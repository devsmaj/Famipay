(() => {
    'use strict';

    const F = window.Famina;
    const emailInput = document.getElementById('verification-email');
    const destination = document.getElementById('verification-destination');
    const status = document.getElementById('verification-status');
    const countdown = document.getElementById('resend-countdown');
    const resendButton = document.getElementById('resend-verification');
    const changeEmailLink = document.getElementById('change-email');
    const pendingKey = 'famina-pending-email-verification';
    const registrationKey = 'famina-registration-success';
    const cooldownPrefix = 'famina-email-confirmation-cooldown:';
    const cooldownMs = 60_000;
    let email = '';
    let cooldownUntil = 0;
    let interval = 0;
    let busy = false;
    let verifiedUser = null;
    let redirectTimer = 0;

    const translate = (key, fallback) =>
        window.i18n?.t(`auth.${key}`, fallback) || fallback;
    const normaliseEmail = value => String(value || '').trim().toLowerCase();
    const callbackUrl = location.hostname === 'devsmaj.github.io'
        ? new URL('/Famipay/', location.origin).href
        : new URL('verify-email.html', location.href).href;

    function setStatus(key, fallback, state = 'pending') {
        status.textContent = translate(key, fallback);
        status.dataset.state = state;
        F?.notify?.(
            status.textContent,
            state === 'success' ? 'success' : state === 'error' ? 'error' : 'info',
        );
    }

    function updateDestination() {
        email = normaliseEmail(emailInput.value);
        destination.textContent = email;
    }

    function cooldownKey(value = email) {
        return cooldownPrefix + encodeURIComponent(value);
    }

    function updateCooldown() {
        const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        resendButton.disabled = busy || Boolean(verifiedUser) || remaining > 0;
        countdown.hidden = remaining === 0;
        if (remaining) {
            countdown.textContent = translate(
                'confirmation_countdown',
                'Resend in {seconds} seconds.',
            ).replace('{seconds}', String(remaining));
        } else if (interval) {
            window.clearInterval(interval);
            interval = 0;
        }
    }

    function startCooldown(until, value = email) {
        cooldownUntil = until;
        try { sessionStorage.setItem(cooldownKey(value), String(until)); } catch (_) {}
        if (interval) window.clearInterval(interval);
        updateCooldown();
        interval = window.setInterval(updateCooldown, 1000);
    }

    function callbackError() {
        const url = new URL(location.href);
        const query = url.searchParams;
        const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
        const code = query.get('error_code') || hash.get('error_code') || '';
        const description = query.get('error_description') || hash.get('error_description') || '';
        const text = `${code} ${description}`.toLowerCase();
        if (code || description) {
            for (const params of [query, hash]) {
                params.delete('error');
                params.delete('error_code');
                params.delete('error_description');
            }
            const nextQuery = query.toString();
            const nextHash = hash.toString();
            history.replaceState(
                null,
                '',
                url.pathname + (nextQuery ? `?${nextQuery}` : '') + (nextHash ? `#${nextHash}` : ''),
            );
        }
        if (/expired/.test(text)) return 'expired';
        if (/already.*(used|verified)|token.*used/.test(text)) return 'used';
        if (/invalid/.test(text)) return 'invalid';
        return '';
    }

    async function matchingVerifiedUser(value = email) {
        await F.ready;
        if (!value) return null;
        if (!F.client) throw new Error(translate(
            'confirmation_check_failed',
            'We could not check verification right now. Please try again.',
        ));
        const {data, error} = await F.client.auth.getSession();
        if (error) throw error;
        const session = data?.session;
        if (!session || normaliseEmail(session.user?.email) !== value) return null;
        const {data: authData, error: authError} = await F.client.auth.getUser(
            session.access_token,
        );
        if (authError) throw authError;
        const authUser = authData?.user;
        if (
            !authUser?.id ||
            authUser.id !== session.user?.id ||
            normaliseEmail(authUser.email) !== value ||
            !authUser.email_confirmed_at
        ) return null;
        try {
            await F.refreshUser(session);
        } catch (error) {
            if ([401, 403].includes(error?.status)) throw error;
        }
        const profile = F.user?.id === authUser.id ? F.user : null;
        const user = {
            ...(profile || {}),
            id: authUser.id,
            email: authUser.email,
            email_verified: true,
            phone_verified: Boolean(authUser.phone_confirmed_at),
            name: profile?.name || authUser.user_metadata?.name || '',
            onboarding_complete: profile?.onboarding_complete === true,
        };
        F.user = user;
        return user;
    }

    function continueToDashboard(user) {
        verifiedUser = user;
        setStatus(
            'verification_success',
            'Email verified successfully!',
            'success',
        );
        resendButton.disabled = true;
        countdown.hidden = true;
        try {
            sessionStorage.removeItem(pendingKey);
            sessionStorage.removeItem(registrationKey);
            sessionStorage.removeItem(cooldownKey());
        } catch (_) {}
        if (redirectTimer) window.clearTimeout(redirectTimer);
        redirectTimer = window.setTimeout(() => {
            location.replace(user.onboarding_complete
                ? 'famipay-app.html'
                : 'famipay-onboarding.html');
        }, 1200);
    }

    async function run(operation) {
        if (busy) return;
        busy = true;
        resendButton.disabled = true;
        const done = window.FaminaLoading?.button?.(resendButton) || (() => {});
        try {
            await F.ready;
            if (!F.client) throw new Error(translate(
                'confirmation_check_failed',
                'We could not complete that request. Please try again.',
            ));
            await operation();
        } catch (error) {
            const message = String(error?.message || '').toLowerCase();
            if (error?.status === 429 || /rate limit|too many requests/.test(message))
                setStatus('confirmation_rate_limited', 'Too many requests. Please wait before trying again.', 'error');
            else
                setStatus('confirmation_check_failed', error?.message || 'We could not resend the confirmation email.', 'error');
        } finally {
            done();
            busy = false;
            updateCooldown();
        }
    }

    emailInput.addEventListener('input', updateDestination);

    resendButton.addEventListener('click', () => {
        if (busy || resendButton.disabled) return;
        email = normaliseEmail(emailInput.value);
        if (!emailInput.checkValidity() || !email) {
            emailInput.reportValidity();
            return;
        }
        try { sessionStorage.setItem(pendingKey, email); } catch (_) {}
        run(async () => {
            const {error} = await F.client.auth.resend({
                type: 'signup',
                email,
                options: {emailRedirectTo: callbackUrl},
            });
            if (error) throw error;
            setStatus(
                'confirmation_sent',
                'Confirmation email sent. Please check your inbox.',
                'success',
            );
            startCooldown(Date.now() + cooldownMs);
        });
    });

    changeEmailLink?.addEventListener('click', () => {
        try { sessionStorage.setItem('famina-change-email', normaliseEmail(emailInput.value)); } catch (_) {}
    });

    window.addEventListener('pagehide', () => {
        if (interval) window.clearInterval(interval);
        if (redirectTimer) window.clearTimeout(redirectTimer);
    }, {once: true});

    (async () => {
        const callbackStatus = callbackError();
        try { email = normaliseEmail(sessionStorage.getItem(pendingKey)); } catch (_) {}
        await F.ready;
        if (!email && F.user?.email) email = normaliseEmail(F.user.email);
        emailInput.value = email;
        updateDestination();

        let registrationSuccess = false;
        try { registrationSuccess = sessionStorage.getItem(registrationKey) === '1'; } catch (_) {}
        if (registrationSuccess)
            setStatus(
                'account_created',
                'Account created! Please check your email to verify your account.',
                'pending',
            );

        if (callbackStatus) {
            const statuses = {
                expired: ['confirmation_expired', 'This confirmation link has expired. Request a new email.'],
                used: ['confirmation_used', 'This confirmation link was already used. Sign in if verification is complete.'],
                invalid: ['confirmation_invalid', 'This confirmation link is invalid. Request a new email.'],
            };
            const [key, fallback] = statuses[callbackStatus];
            setStatus(key, fallback, 'error');
        }

        try {
            const user = await matchingVerifiedUser();
            if (user) {
                continueToDashboard(user);
                return;
            }
        } catch (_) {
            if (!callbackStatus && !registrationSuccess) setStatus(
                'confirmation_check_failed',
                'We could not check verification right now. Please try again.',
                'error',
            );
        }

        if (!email) setStatus(
            'confirmation_enter_email',
            'Enter the email address you used to register.',
        );

        try {
            const storedUntil = Number(sessionStorage.getItem(cooldownKey()));
            if (Number.isFinite(storedUntil) && storedUntil > Date.now())
                startCooldown(storedUntil);
        } catch (_) {}
    })();
})();
