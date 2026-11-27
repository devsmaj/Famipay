(() => {
    'use strict';

    const F = window.Famina;
    const form = document.getElementById('verification-form');
    const emailInput = document.getElementById('verification-email');
    const status = document.getElementById('verification-status');
    const countdown = document.getElementById('resend-countdown');
    const resendButton = document.getElementById('resend-verification');
    const continueButton = document.getElementById('continue-verification');
    const pendingKey = 'famina-pending-email-verification';
    const cooldownPrefix = 'famina-email-verification-cooldown:';
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

    function setStatus(key, fallback, state = 'pending') {
        status.textContent = translate(key, fallback);
        status.dataset.state = state;
    }

    function emailIsValid() {
        email = normaliseEmail(emailInput.value);
        emailInput.value = email;
        if (emailInput.checkValidity() && email) return true;
        emailInput.reportValidity();
        return false;
    }

    function savePendingEmail() {
        try {
            if (email) sessionStorage.setItem(pendingKey, email);
        } catch (_) {}
    }

    function cooldownKey() {
        return cooldownPrefix + encodeURIComponent(email);
    }

    function startCooldown(until) {
        cooldownUntil = until;
        try { sessionStorage.setItem(cooldownKey(), String(until)); } catch (_) {}
        if (interval) window.clearInterval(interval);
        updateCooldown();
        interval = window.setInterval(updateCooldown, 1000);
    }

    function updateCooldown() {
        const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        resendButton.disabled = Boolean(verifiedUser) || busy || remaining > 0;
        countdown.hidden = remaining === 0;
        if (remaining) {
            countdown.textContent = translate(
                'verification_countdown',
                'You can request another link in {seconds} seconds.',
            ).replace('{seconds}', String(remaining));
        } else if (interval) {
            window.clearInterval(interval);
            interval = 0;
        }
    }

    function expiredLinkError() {
        const url = new URL(location.href);
        const search = url.searchParams;
        const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
        const errorCode = search.get('error_code') || hash.get('error_code') || '';
        const description = search.get('error_description') || hash.get('error_description') || '';
        const expired = /expired|invalid|already used/i.test(`${errorCode} ${description}`);
        if (errorCode || description) {
            for (const params of [search, hash]) {
                params.delete('error');
                params.delete('error_code');
                params.delete('error_description');
            }
            const fragment = hash.toString();
            const query = search.toString();
            history.replaceState(
                null,
                '',
                url.pathname + (query ? `?${query}` : '') + (fragment ? `#${fragment}` : ''),
            );
        }
        return expired;
    }

    async function matchingVerifiedUser() {
        await F.ready;
        if (!email) return null;
        if (!F.client) throw new Error(translate(
            'verification_check_failed',
            'We could not check verification right now. Please try again.',
        ));
        const {data, error} = await F.client.auth.getSession();
        if (error) throw error;
        if (!data.session) return null;
        await F.refreshUser(data.session);
        const user = F.user;
        if (!user || normaliseEmail(user.email) !== email || !user.email_verified) return null;
        return user;
    }

    function continueToDashboard(user) {
        verifiedUser = user;
        setStatus(
            'verification_success',
            'Email verified successfully. Opening your FAMIPAY account…',
            'success',
        );
        resendButton.disabled = true;
        countdown.hidden = true;
        try {
            sessionStorage.removeItem(pendingKey);
            sessionStorage.removeItem(cooldownKey());
        } catch (_) {}
        if (redirectTimer) window.clearTimeout(redirectTimer);
        redirectTimer = window.setTimeout(() => {
            const destination = user.onboarding_complete
                ? 'famipay-app.html'
                : 'famipay-onboarding.html';
            location.replace(destination);
        }, 1400);
    }

    async function run(button, operation) {
        if (busy) return;
        busy = true;
        const done = window.FaminaLoading.button(button);
        try {
            await operation();
        } catch (error) {
            setStatus(
                'verification_check_failed',
                error.message || 'We could not complete that request. Please try again.',
                'error',
            );
        } finally {
            done();
            busy = false;
            updateCooldown();
        }
    }

    resendButton.addEventListener('click', () => {
        if (!emailIsValid() || resendButton.disabled) return;
        savePendingEmail();
        run(resendButton, async () => {
            const {error} = await F.client.auth.resend({
                type: 'signup',
                email,
                options: {emailRedirectTo: new URL('verify-email.html', location.href).href},
            });
            if (error) {
                if (error.status === 429 || /rate limit|too many requests/i.test(error.message || ''))
                    startCooldown(Date.now() + cooldownMs);
                throw error;
            }
            setStatus(
                'verification_sent',
                'If this address still needs verification, a fresh link has been sent.',
            );
            startCooldown(Date.now() + cooldownMs);
        });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!emailIsValid()) return;
        savePendingEmail();
        if (verifiedUser) {
            continueToDashboard(verifiedUser);
            return;
        }
        run(continueButton, async () => {
            const user = await matchingVerifiedUser();
            if (!user) {
                setStatus(
                    'verification_not_yet',
                    'We cannot confirm this email yet. Open the link on this device, then try again.',
                    'error',
                );
                return;
            }
            continueToDashboard(user);
        });
    });

    window.addEventListener('pagehide', () => {
        if (interval) window.clearInterval(interval);
        if (redirectTimer) window.clearTimeout(redirectTimer);
    }, {once: true});

    (async () => {
        let expired = expiredLinkError();
        try {
            email = normaliseEmail(sessionStorage.getItem(pendingKey));
        } catch (_) {}
        await F.ready;
        if (!email && F.user?.email) email = normaliseEmail(F.user.email);
        emailInput.value = email;

        if (expired) {
            setStatus(
                'verification_expired',
                'This verification link expired or was already used. Request a fresh link, or sign in if you already verified.',
                'error',
            );
        }

        try {
            const user = await matchingVerifiedUser();
            if (user) {
                continueToDashboard(user);
                return;
            }
        } catch (_) {
            if (!expired) setStatus(
                'verification_check_failed',
                'We could not check verification right now. Please try again.',
                'error',
            );
        }

        if (!email) {
            setStatus(
                'verification_enter_email',
                'Enter the email address you used to register.',
            );
            return;
        }

        try {
            const storedUntil = Number(sessionStorage.getItem(cooldownKey()));
            if (Number.isFinite(storedUntil) && storedUntil > Date.now()) startCooldown(storedUntil);
        } catch (_) {}
    })();
})();
