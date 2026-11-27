(() => {
    'use strict';

    const F = window.Famina;
    const status = document.getElementById('auth-status');
    const message = document.getElementById('onboarding-message');
    const profileStep = document.getElementById('profile-step');
    const pinStep = document.getElementById('pin-step');
    const readyStep = document.getElementById('ready-step');
    const progress = [...document.querySelectorAll('[data-onboarding-step]')];
    let busy = false;
    const translate = (key, fallback) =>
        window.i18n?.t(`auth.errors.${key}`, fallback) || fallback;

    function setProgress(current) {
        progress.forEach((item, index) => {
            item.dataset.complete = String(index < current);
            if (index === current) item.setAttribute('aria-current', 'step');
            else item.removeAttribute('aria-current');
        });
    }

    function setBusy(button, value) {
        button.disabled = value;
        if (value) {
            button.setAttribute('aria-busy', 'true');
            const spinner = document.createElement('span');
            spinner.className = 'fp-onboarding-spinner';
            spinner.setAttribute('aria-hidden', 'true');
            button.append(spinner);
        } else {
            button.removeAttribute('aria-busy');
            button.querySelector('.fp-onboarding-spinner')?.remove();
        }
    }

    async function verifiedSession() {
        const {data, error} = await F.client.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error('Please sign in again.');
        await F.refreshUser(data.session, {force: true});
        if (!F.user || (!F.user.email_verified && !F.user.phone_verified))
            throw new Error('Verify your email address or phone number before continuing.');
        return data.session;
    }

    function showStep(step) {
        profileStep.hidden = step !== 'profile';
        pinStep.hidden = step !== 'pin';
        readyStep.hidden = step !== 'ready';
        message.textContent = '';
        const progressIndex = {profile: 2, pin: 3, ready: 4}[step];
        setProgress(progressIndex);
    }

    async function run(button, operation) {
        if (busy) return;
        busy = true;
        setBusy(button, true);
        try {
            await operation();
        } catch (error) {
            F.notify(error.message, 'error');
        } finally {
            setBusy(button, false);
            busy = false;
        }
    }

    document.getElementById('profile-form').addEventListener('submit', event => {
        event.preventDefault();
        const form = event.currentTarget;
        const button = form.querySelector('[type="submit"]');
        const name = document.getElementById('profile-name').value.trim();
        if (!form.reportValidity() || name.length < 1 || name.length > 100) return;

        run(button, async () => {
            await F.api('/profile', {method: 'PUT', body: {name}});
            await verifiedSession();
            showStep('pin');
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
            F.notify('PIN must contain exactly six digits.', 'error');
            return;
        }
        if (pin !== confirmation) {
            F.notify('PIN entries do not match.', 'error');
            return;
        }

        run(button, async () => {
            try {
                const result = await F.api('/auth/pin', {method: 'POST', body: {pin}});
                if (result?.onboarding_complete !== true)
                    throw new Error(translate('onboarding_failed', 'Account setup could not be completed. Please try again.'));
                await verifiedSession();
                if (!F.user.onboarding_complete)
                    throw new Error(translate('onboarding_unconfirmed', 'Account setup could not be confirmed. Please try again.'));
                status.hidden = true;
                showStep('ready');
                window.setTimeout(() => location.replace('famipay-app.html'), 1200);
            } finally {
                form.reset();
            }
        });
    });

    document.getElementById('open-home').addEventListener('click', () => {
        location.replace('famipay-app.html');
    });

    (async () => {
        try {
            await F.ready;
            if (!F.user) {
                location.replace('login.html');
                return;
            }
            if (!F.user.email_verified && !F.user.phone_verified) {
                throw new Error('Verify your email address or phone number before continuing.');
            }
            if (F.user.onboarding_complete) {
                location.replace('famipay-app.html');
                return;
            }
            document.getElementById('profile-name').value = F.user.name || '';
            status.hidden = true;
            showStep('profile');
        } catch (error) {
            status.hidden = true;
            message.textContent = error.message || translate('verification_unavailable', 'Unable to verify your account. Please try again.');
            const link = document.createElement('a');
            link.href = 'login.html';
            link.textContent = 'Return to sign in';
            message.append(' ', link);
        }
    })();
})();
