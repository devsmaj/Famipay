(() => {
    'use strict';

    const F = window.Famina;
    const form = document.getElementById('verification-form');
    const emailInput = document.getElementById('verification-email');
    const codeInput = document.getElementById('verification-code');
    const destination = document.getElementById('verification-destination');
    const status = document.getElementById('verification-status');
    const countdown = document.getElementById('resend-countdown');
    const resendButton = document.getElementById('resend-verification');
    const verifyButton = document.getElementById('verify-email-button');
    const changeEmailLink = document.getElementById('change-email');
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
    const verificationError = (key, fallback) => {
        const error = new Error(translate(key, fallback));
        error.code = key;
        return error;
    };

    function setStatus(key, fallback, state = 'pending', notify = false) {
        const text = translate(key, fallback);
        status.textContent = text;
        status.dataset.state = state;
        if (notify && typeof F.notify === 'function')
            F.notify(text, state === 'error' ? 'error' : 'success');
    }

    function updateDestination(value = emailInput.value) {
        const address = normaliseEmail(value);
        destination.textContent = '';
        if (address) {
            const addressNode = document.createElement('strong');
            addressNode.textContent = address;
            destination.append(addressNode);
        }
    }

    function emailIsValid() {
        email = normaliseEmail(emailInput.value);
        emailInput.value = email;
        if (emailInput.checkValidity() && email) {
            updateDestination(email);
            return true;
        }
        emailInput.reportValidity();
        return false;
    }

    function savePendingEmail(value = email) {
        try {
            if (value) sessionStorage.setItem(pendingKey, value);
        } catch (_) {}
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
                'verification_countdown',
                'Resend code in {seconds} seconds.',
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
        const error = `${code} ${description}`.toLowerCase();
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
        if (/expired/.test(error)) return 'expired';
        if (/already.*(used|verified)|token.*used/.test(error)) return 'used';
        if (/invalid|otp/.test(error)) return 'invalid';
        return '';
    }

    async function matchingVerifiedUser(value = email) {
        await F.ready;
        if (!value) return null;
        if (!F.client) throw new Error(translate(
            'verification_check_failed',
            'We could not check verification right now. Please try again.',
        ));
        const {data, error} = await F.client.auth.getSession();
        if (error) throw error;
        const session = data?.session;
        if (!session || normaliseEmail(session.user?.email) !== value) return null;
        await F.refreshUser(session);
        const user = F.user;
        if (!user || normaliseEmail(user.email) !== value || !user.email_verified) return null;
        return user;
    }

    function continueToDashboard(user) {
        verifiedUser = user;
        setStatus(
            'verification_success',
            'Email verified successfully!',
            'success',
            true,
        );
        resendButton.disabled = true;
        verifyButton.disabled = true;
        countdown.hidden = true;
        try {
            sessionStorage.removeItem(pendingKey);
            sessionStorage.removeItem(cooldownKey());
        } catch (_) {}
        if (redirectTimer) window.clearTimeout(redirectTimer);
        redirectTimer = window.setTimeout(() => {
            const destinationPage = user.onboarding_complete
                ? 'famipay-app.html'
                : 'famipay-onboarding.html';
            location.replace(destinationPage);
        }, 1200);
    }

    function errorStatus(error) {
        const code = String(error?.code || '').toLowerCase();
        const message = String(error?.message || '').toLowerCase();
        const verificationErrors = {
            verification_session_missing: 'The code was accepted, but your sign-in session is unavailable. Please sign in.',
            verification_account_mismatch: 'The verified account does not match this email address.',
            verification_not_confirmed: 'Supabase could not confirm this account yet. Please try again.',
        };
        if (verificationErrors[code]) return [code, verificationErrors[code]];
        if (/already.*(used|verified)|token.*used|already_used/.test(`${code} ${message}`))
            return ['verification_code_used', 'This code was already used. Request a new code if needed.'];
        if (code === 'otp_expired' || (/expired/.test(message) && !/invalid/.test(message)))
            return ['verification_code_expired', 'This code has expired. Request a new code.'];
        if (/invalid|token|otp/.test(`${code} ${message}`))
            return ['verification_code_invalid', 'That code is incorrect. Check it and try again.'];
        if (/rate limit|too many requests/.test(message))
            return ['verification_rate_limited', 'Too many requests. Please wait before trying again.'];
        return [
            'verification_check_failed',
            error?.message || 'We could not complete that request. Please try again.',
        ];
    }

    async function run(button, operation) {
        if (busy) return;
        busy = true;
        const priorDisabled = [verifyButton, resendButton].map(item => item.disabled);
        verifyButton.disabled = true;
        resendButton.disabled = true;
        const done = window.FaminaLoading?.button?.(button) || (() => {});
        try {
            await F.ready;
            if (!F.client) throw new Error(translate(
                'verification_check_failed',
                'We could not complete that request. Please try again.',
            ));
            await operation();
        } catch (error) {
            const [key, fallback] = errorStatus(error);
            setStatus(key, fallback, 'error', true);
        } finally {
            done();
            busy = false;
            if (!verifiedUser) {
                verifyButton.disabled = priorDisabled[0];
                updateCooldown();
            }
        }
    }

    emailInput.addEventListener('input', () => updateDestination());
    codeInput.addEventListener('input', () => {
        codeInput.value = codeInput.value.replace(/\D/g, '').slice(0, 6);
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!emailIsValid()) return;
        const targetEmail = email;
        const token = codeInput.value.trim();
        if (!/^\d{6}$/.test(token)) {
            setStatus(
                'verification_code_invalid',
                'Enter the 6-digit verification code.',
                'error',
            );
            codeInput.focus();
            return;
        }
        savePendingEmail(targetEmail);
        run(verifyButton, async () => {
            const {data, error} = await F.client.auth.verifyOtp({
                email: targetEmail,
                token,
                type: 'email',
            });
            if (error) throw error;
            const {data: current, error: sessionError} = await F.client.auth.getSession();
            if (sessionError) throw sessionError;
            const session = current?.session || data?.session;
            if (!session) throw verificationError(
                'verification_session_missing',
                'The code was accepted, but your sign-in session is unavailable. Please sign in.',
            );
            if (normaliseEmail(session.user?.email) !== targetEmail)
                throw verificationError(
                    'verification_account_mismatch',
                    'The verified account does not match this email address.',
                );
            await F.refreshUser(session);
            const user = F.user;
            if (!user || user.id !== session.user?.id ||
                normaliseEmail(user.email) !== targetEmail || !user.email_verified)
                throw verificationError(
                    'verification_not_confirmed',
                    'Supabase could not confirm this account yet. Please try again.',
                );
            continueToDashboard(user);
        });
    });

    resendButton.addEventListener('click', () => {
        if (busy || resendButton.disabled || !emailIsValid()) return;
        const targetEmail = email;
        savePendingEmail(targetEmail);
        run(resendButton, async () => {
            const {error} = await F.client.auth.resend({
                type: 'signup',
                email: targetEmail,
            });
            if (error) {
                if (error.status === 429 || /rate limit|too many requests/i.test(error.message || ''))
                    startCooldown(Date.now() + cooldownMs, targetEmail);
                throw error;
            }
            setStatus(
                'verification_sent',
                'If this address still needs verification, a new code has been sent.',
                'success',
                true,
            );
            startCooldown(Date.now() + cooldownMs, targetEmail);
        });
    });

    changeEmailLink.addEventListener('click', () => {
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
        updateDestination(email);

        if (callbackStatus) {
            const statuses = {
                expired: ['verification_code_expired', 'This code has expired. Request a new code.'],
                used: ['verification_code_used', 'This code was already used. Request a new code if needed.'],
                invalid: ['verification_code_invalid', 'That code is invalid. Request a new code and try again.'],
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
            if (!callbackStatus) setStatus(
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
