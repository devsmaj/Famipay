(() => {
    'use strict';

    const F = window.Famina;
    const backButton = document.getElementById('onboarding-back');
    const verifyStep = document.getElementById('verify-step');
    const profileStep = document.getElementById('profile-step');
    const pinStep = document.getElementById('pin-step');
    const readyStep = document.getElementById('ready-step');
    const steps = [...document.querySelectorAll('[data-onboarding-step]')];
    const progressBar = document.getElementById('onboarding-progress-bar');
    const inlineState = document.getElementById('verification-state');
    const errorPanel = document.getElementById('onboarding-error');
    const errorText = document.getElementById('onboarding-error-text');
    const retryVerification = document.getElementById('retry-verification');
    const retryOnboarding = document.getElementById('retry-onboarding');
    const verificationTimeoutMs = 12_000;
    const operationTimeoutMs = 20_000;
    let activeStep = 'verify';
    let busy = false;
    let runId = 0;
    let lastOperation = verifyAccount;

    const translate = (key, fallback) =>
        window.i18n?.t(`onboarding.${key}`, fallback) || fallback;
    const authError = (key, fallback) =>
        window.i18n?.t(`auth.errors.${key}`, fallback) || fallback;

    function withTimeout(promise, message, timeoutMs = operationTimeoutMs) {
        let timer;
        return Promise.race([
            promise,
            new Promise((_, reject) => {
                timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
            }),
        ]).finally(() => window.clearTimeout(timer));
    }

    function setBusy(button, value) {
        if (!button) return;
        button.disabled = value;
        button.setAttribute('aria-busy', String(value));
        if (value) {
            const spinner = document.createElement('span');
            spinner.className = 'fp-onboarding-spinner';
            spinner.setAttribute('aria-hidden', 'true');
            button.append(spinner);
        } else {
            button.querySelector('.fp-onboarding-spinner')?.remove();
        }
    }

    function setProgress(step) {
        const indexByStep = {verify: 0, profile: 1, pin: 2, ready: 3};
        const current = indexByStep[step] ?? 0;
        steps.forEach((item, index) => {
            item.dataset.complete = String(index < current);
            if (index === current) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
        });
        progressBar.style.width = `${(current / (steps.length - 1)) * 100}%`;
    }

    function showStep(step) {
        activeStep = step;
        verifyStep.hidden = step !== 'verify';
        profileStep.hidden = step !== 'profile';
        pinStep.hidden = step !== 'pin';
        readyStep.hidden = step !== 'ready';
        errorPanel.hidden = true;
        setProgress(step);
        const heading = {
            verify: document.getElementById('verify-title'),
            profile: document.getElementById('profile-title'),
            pin: document.getElementById('pin-title'),
            ready: document.getElementById('ready-title'),
        }[step];
        heading?.focus({preventScroll: true});
    }

    function showInlineState(text, state = 'pending') {
        inlineState.dataset.state = state;
        inlineState.hidden = false;
        inlineState.textContent = text;
    }

    function showError(error, {retry = true} = {}) {
        const text = error?.message || translate(
            'verification_unavailable',
            'Unable to verify your account. Please try again.',
        );
        showInlineState(text, 'error');
        if (activeStep === 'verify') {
            errorPanel.hidden = true;
            retryVerification.hidden = !retry;
        } else {
            errorText.textContent = text;
            errorPanel.hidden = false;
            retryOnboarding.hidden = !retry;
        }
    }

    async function getVerifiedSession() {
        await withTimeout(F.ready, translate('timeout', 'This is taking longer than expected. Please retry.'), verificationTimeoutMs);
        if (!F.client) throw new Error(translate(
            'service_unavailable',
            'FAMIPAY authentication is temporarily unavailable. Please retry.',
        ));
        const {data, error} = await withTimeout(
            F.client.auth.getSession(),
            translate('timeout', 'This is taking longer than expected. Please retry.'),
            verificationTimeoutMs,
        );
        if (error) throw error;
        const session = data?.session;
        if (!session) throw new Error(translate(
            'session_required',
            'Your session has expired. Sign in again, then return to account setup.',
        ));
        const supabaseUser = session.user;
        const emailConfirmed = Boolean(
            supabaseUser?.email_confirmed_at ||
            supabaseUser?.confirmed_at,
        );
        const phoneConfirmed = Boolean(supabaseUser?.phone_confirmed_at);
        if (!emailConfirmed && !phoneConfirmed) {
            throw new Error(translate(
                'verify_required',
                'Your email or phone has not been verified yet. Open the confirmation message and retry.',
            ));
        }
        await withTimeout(
            F.refreshUser(session, {force: true}),
            translate('timeout', 'This is taking longer than expected. Please retry.'),
            verificationTimeoutMs,
        );
        if (!F.user || F.user.id !== supabaseUser.id) {
            throw new Error(translate(
                'profile_unavailable',
                'We could not load your account details. Please retry.',
            ));
        }
        if (!F.user.email_verified && !F.user.phone_verified) {
            throw new Error(translate(
                'profile_verification_pending',
                'Supabase confirmed your session, but account status is still syncing. Please retry shortly.',
            ));
        }
        return {session, user: F.user, emailConfirmed};
    }

    async function verifyAccount() {
        activeStep = 'verify';
        showStep('verify');
        showInlineState(translate('checking', 'Verifying your account…'), 'pending');
        retryVerification.hidden = true;
        errorPanel.hidden = true;
        const operationId = ++runId;
        try {
            const {user, emailConfirmed} = await getVerifiedSession();
            if (operationId !== runId) return;
            showInlineState(emailConfirmed
                ? translate('verified', 'Email verified successfully!')
                : translate('phone_verified', 'Phone verified successfully!'), 'success');
            if (user.onboarding_complete) {
                location.replace('famipay-app.html');
                return;
            }
            const profileName = document.getElementById('profile-name');
            if (!profileName.value) profileName.value = user.name || '';
            window.setTimeout(() => {
                if (operationId === runId) showStep('profile');
            }, 550);
        } catch (error) {
            if (operationId !== runId) return;
            showError(error);
        }
    }

    async function run(button, operation) {
        if (busy) return;
        busy = true;
        backButton.disabled = true;
        const operationId = ++runId;
        setBusy(button, true);
        errorPanel.hidden = true;
        try {
            await operation(operationId);
        } catch (error) {
            if (operationId === runId) showError(error);
        } finally {
            setBusy(button, false);
            backButton.disabled = false;
            busy = false;
        }
    }

    backButton.addEventListener('click', () => {
        if (busy) return;
        if (activeStep === 'pin') {
            showStep('profile');
            document.getElementById('profile-name').focus();
        } else if (activeStep === 'profile') {
            showStep('verify');
        } else if (activeStep === 'ready') {
            location.replace('famipay-app.html');
        } else {
            location.assign('verify-email.html');
        }
    });

    document.getElementById('profile-form').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const button = form.querySelector('[type="submit"]');
        const name = document.getElementById('profile-name').value.trim();
        if (!form.reportValidity() || name.length < 1 || name.length > 100) return;
        lastOperation = () => {
            showStep('profile');
            run(button, async () => {
                await getVerifiedSession();
                const submittedName = document.getElementById('profile-name').value.trim();
                if (!submittedName || submittedName.length > 100)
                    throw new Error(translate('name_required', 'Enter your name to continue.'));
                await withTimeout(
                    F.api('/profile', {method: 'PUT', body: {name: submittedName}}),
                    translate('timeout', 'This is taking longer than expected. Please retry.'),
                );
                await getVerifiedSession();
                showStep('pin');
                document.getElementById('account-pin').focus();
            });
        };
        lastOperation();
    });

    document.getElementById('pin-form').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const button = form.querySelector('[type="submit"]');
        const pin = document.getElementById('account-pin').value;
        const confirmation = document.getElementById('confirm-pin').value;
        if (!form.reportValidity()) return;
        if (!/^\d{6}$/.test(pin)) {
            showError(new Error(authError('pin_format', 'PIN must contain exactly six digits.')), {retry: false});
            return;
        }
        if (pin !== confirmation) {
            showError(new Error(authError('pin_mismatch', 'PIN entries do not match.')), {retry: false});
            return;
        }

        lastOperation = () => {
            showStep('pin');
            const retryPin = document.getElementById('account-pin').value;
            const retryConfirmation = document.getElementById('confirm-pin').value;
            if (!/^\d{6}$/.test(retryPin) || retryPin !== retryConfirmation) {
                showError(new Error(translate(
                    'pin_retry',
                    'Re-enter and confirm your secure PIN, then try again.',
                )), {retry: false});
                document.getElementById('account-pin').focus();
                return;
            }
            run(button, async () => {
                await getVerifiedSession();
                let result;
                try {
                    result = await withTimeout(
                        F.api('/auth/pin', {method: 'POST', body: {pin: retryPin}}),
                        translate('timeout', 'This is taking longer than expected. Please retry.'),
                    );
                } catch (error) {
                    await getVerifiedSession();
                    if (F.user.onboarding_complete) {
                        form.reset();
                        showStep('ready');
                        return;
                    }
                    throw error;
                }
                if (result?.onboarding_complete !== true)
                    throw new Error(authError('onboarding_failed', 'Account setup could not be completed. Please try again.'));
                await getVerifiedSession();
                if (!F.user.onboarding_complete)
                    throw new Error(authError('onboarding_unconfirmed', 'Account setup could not be confirmed. Please try again.'));
                form.reset();
                showStep('ready');
            }).finally(() => form.reset());
        };
        lastOperation();
    });

    document.getElementById('retry-verification').addEventListener('click', () => {
        lastOperation = verifyAccount;
        verifyAccount();
    });

    document.getElementById('retry-onboarding').addEventListener('click', () => {
        if (lastOperation) lastOperation();
    });

    document.getElementById('open-home').addEventListener('click', () => {
        location.replace('famipay-app.html');
    });

    document.addEventListener('languagechange', () => {
        if (inlineState.dataset.state === 'pending')
            showInlineState(translate('checking', 'Verifying your account…'), 'pending');
    });

    verifyAccount();
})();
