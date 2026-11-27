(() => {
    'use strict';

    const F = window.Famina;
    const firstNameInput = document.getElementById('profile-first-name');
    const lastNameInput = document.getElementById('profile-last-name');
    const phoneInput = document.getElementById('profile-phone');
    const phoneFlag = document.getElementById('profile-phone-flag');
    const phoneLibrary = window.libphonenumber;
    const backButton = document.getElementById('onboarding-back');
    const verifyStep = document.getElementById('verify-step');
    const profileStep = document.getElementById('profile-step');
    const pinStep = document.getElementById('pin-step');
    const readyStep = document.getElementById('ready-step');
    const steps = [...document.querySelectorAll('[data-onboarding-step]')];
    const progressBar = document.getElementById('onboarding-progress-bar');
    const inlineState = document.getElementById('verification-state');
    const verificationTimeoutMs = 12_000;
    const operationTimeoutMs = 20_000;
    let activeStep = 'verify';
    let busy = false;
    let runId = 0;

    const translate = (key, fallback) =>
        window.i18n?.t(`onboarding.${key}`, fallback) || fallback;
    const authError = (key, fallback) =>
        window.i18n?.t(`auth.errors.${key}`, fallback) || fallback;

    function normalizePhoneDigits(value) {
        return value.replace(/[٠-٩۰-۹]/g, digit =>
            String(digit.codePointAt(0) <= 0x0669
                ? digit.codePointAt(0) - 0x0660
                : digit.codePointAt(0) - 0x06f0));
    }

    function internationalPhone(value) {
        const normalized = normalizePhoneDigits(value.trim());
        return normalized.startsWith('00')
            ? `+${normalized.slice(2)}`
            : normalized;
    }

    function flagForCountry(country) {
        if (!/^[A-Z]{2}$/.test(country || '')) return '🇹🇩';
        return [...country].map(letter =>
            String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
    }

    function savedProfileDetails(user) {
        const parts = (user.name || '').trim().split(/\s+/);
        const firstName = user.first_name || parts[0] || '';
        const lastName = user.last_name || parts.slice(1).join(' ');
        const phone = phoneLibrary.parsePhoneNumberFromString(user.phone || '');
        return Boolean(firstName.trim() && lastName.trim() && phone?.isValid());
    }

    function updatePhoneFlag() {
        const formatter = new phoneLibrary.AsYouType();
        formatter.input(internationalPhone(phoneInput.value));
        phoneFlag.textContent = flagForCountry(formatter.getCountry());
    }

    phoneInput.addEventListener('input', () => {
        const normalized = normalizePhoneDigits(phoneInput.value);
        if (normalized !== phoneInput.value) phoneInput.value = normalized;
        updatePhoneFlag();
    });

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
        inlineState.textContent = text;
        if (state !== 'pending') F.notify(text, state);
    }

    function showError(error) {
        const text = error?.message || translate(
            'verification_unavailable',
            'Unable to verify your account. Please try again.',
        );
        showInlineState(text, 'error');
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
        const {data: authData, error: authError} = await withTimeout(
            F.client.auth.getUser(session.access_token),
            translate('timeout', 'This is taking longer than expected. Please retry.'),
            verificationTimeoutMs,
        );
        if (authError) throw authError;
        const supabaseUser = authData?.user;
        if (!supabaseUser?.id || supabaseUser.id !== session.user?.id) {
            throw new Error(translate(
                'session_required',
                'Your session has expired. Sign in again, then return to account setup.',
            ));
        }
        const emailConfirmed = Boolean(supabaseUser.email_confirmed_at);
        const phoneConfirmed = Boolean(supabaseUser.phone_confirmed_at);
        if (!emailConfirmed && !phoneConfirmed) {
            throw new Error(translate(
                'verify_required',
                'Your email or phone has not been verified yet. Open the confirmation message and retry.',
            ));
        }
        try {
            await withTimeout(
                F.refreshUser(session, {force: true}),
                translate('timeout', 'This is taking longer than expected. Please retry.'),
                verificationTimeoutMs,
            );
        } catch (error) {
            if ([401, 403].includes(error?.status)) throw error;
        }
        const profile = F.user?.id === supabaseUser.id ? F.user : null;
        const user = {
            ...(profile || {}),
            id: supabaseUser.id,
            email: supabaseUser.email || session.user.email || null,
            email_verified: emailConfirmed,
            phone_verified: phoneConfirmed,
            name: profile?.name || supabaseUser.user_metadata?.name || '',
            onboarding_complete: profile?.onboarding_complete === true,
        };
        F.user = user;
        return {session, user, emailConfirmed};
    }

    async function verifyAccount() {
        activeStep = 'verify';
        showStep('verify');
        showInlineState(translate('checking', 'Verifying your account…'), 'pending');
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
            const nameParts = (user.name || '').trim().split(/\s+/);
            if (!firstNameInput.value) firstNameInput.value = user.first_name || nameParts[0] || '';
            if (!lastNameInput.value) lastNameInput.value = user.last_name || nameParts.slice(1).join(' ');
            if (user.phone && phoneInput.value.trim() === '+235') phoneInput.value = user.phone;
            updatePhoneFlag();
            if (savedProfileDetails(user)) {
                showStep('pin');
                document.getElementById('account-pin').focus();
                return;
            }
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
            firstNameInput.focus();
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
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const parsedPhone = phoneLibrary.parsePhoneNumberFromString(
            internationalPhone(phoneInput.value),
        );
        if (!form.reportValidity()) return;
        if (!firstName || firstName.length > 80) {
            showError(new Error(translate('first_name_required', 'Enter a valid first name.')));
            firstNameInput.focus();
            return;
        }
        if (!lastName || lastName.length > 80) {
            showError(new Error(translate('last_name_required', 'Enter a valid last name.')));
            lastNameInput.focus();
            return;
        }
        if (!parsedPhone?.isValid()) {
            showError(new Error(translate('phone_invalid', 'Enter a valid international phone number, including its country code.')));
            phoneInput.focus();
            return;
        }
        showStep('profile');
        run(button, async () => {
            await getVerifiedSession();
            const submittedFirstName = firstNameInput.value.trim();
            const submittedLastName = lastNameInput.value.trim();
            const submittedPhone = phoneLibrary.parsePhoneNumberFromString(
                internationalPhone(phoneInput.value),
            );
            if (!submittedFirstName || submittedFirstName.length > 80)
                throw new Error(translate('first_name_required', 'Enter a valid first name.'));
            if (!submittedLastName || submittedLastName.length > 80)
                throw new Error(translate('last_name_required', 'Enter a valid last name.'));
            if (!submittedPhone?.isValid())
                throw new Error(translate('phone_invalid', 'Enter a valid international phone number, including its country code.'));
            try {
                await withTimeout(
                    F.api('/profile', {
                        method: 'PUT',
                        body: {
                            firstName: submittedFirstName,
                            lastName: submittedLastName,
                            phone: submittedPhone.number,
                        },
                    }),
                    translate('timeout', 'This is taking longer than expected. Please retry.'),
                );
            } catch (error) {
                if (error.field === 'firstName')
                    throw new Error(translate('first_name_required', 'Enter a valid first name.'));
                if (error.field === 'lastName')
                    throw new Error(translate('last_name_required', 'Enter a valid last name.'));
                if (error.field === 'phone')
                    throw new Error(translate('phone_invalid', 'Enter a valid international phone number, including its country code.'));
                throw error;
            }
            await getVerifiedSession();
            showStep('pin');
            F.notify(translate('profile_saved', 'Personal details saved.'), 'success');
            document.getElementById('account-pin').focus();
        });
    });

    document.getElementById('pin-form').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const button = form.querySelector('[type="submit"]');
        const pin = document.getElementById('account-pin').value;
        const confirmation = document.getElementById('confirm-pin').value;
        if (!form.reportValidity()) return;
        if (!/^\d{6}$/.test(pin)) {
            showError(new Error(authError('pin_format', 'PIN must contain exactly six digits.')));
            return;
        }
        if (pin !== confirmation) {
            showError(new Error(authError('pin_mismatch', 'PIN entries do not match.')));
            return;
        }

        const retryPin = pin;
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
                    F.notify(translate('pin_saved', 'Secure PIN saved.'), 'success');
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
            F.notify(translate('pin_saved', 'Secure PIN saved.'), 'success');
        });
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
