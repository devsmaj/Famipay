(function () {
  const F = window.Famina, panel = document.getElementById('firebase-auth');
  if (!panel || panel.dataset.authInitialized) return;
  panel.dataset.authInitialized = 'true';
  const phoneForm = document.getElementById('phone-form');
  const codeForm = document.getElementById('phone-code-form');
  const phoneInput = document.getElementById('auth-phone');
  const passwordInput = document.getElementById('auth-password');
  const confirmation = document.getElementById('auth-confirm-password');
  const terms = document.getElementById('auth-terms');
  const existing = document.getElementById('already-registered');
  const resetButton = document.getElementById('reset-password');
  const resetForm = document.getElementById('password-reset-form');
  const codeInput = document.getElementById('auth-code');
  const resend = document.getElementById('resend-code');
  const changePhone = document.getElementById('change-phone');
  let sentPhone = '', resendAt = 0, busy = false, leaving = false, recovery = false, releaseAction = () => {};
  const message = (key, fallback) => window.i18n?.t('auth.errors.' + key, fallback) || fallback;
  const label = (key, fallback) => window.i18n?.t('auth.' + key, fallback) || fallback;
  phoneInput.addEventListener('input', () => {
    if (/^\s*\+235/.test(phoneInput.value)) phoneInput.value = phoneInput.value.replace(/^\s*\+235\s*/, '');
  });
  panel.addEventListener('click', event => {
    const toggle = event.target.closest('[data-password-toggle]');
    if (!toggle || !panel.contains(toggle)) return;
    const input = document.getElementById(toggle.dataset.passwordToggle);
    if (!input) return;
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.setAttribute('aria-label', visible ? label('hide_password', 'Hide password') : label('show_password', 'Show password'));
  });
  document.addEventListener('languagechange', () => {
    panel.querySelectorAll('[data-password-toggle]').forEach(toggle => {
      const visible = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-label', visible ? label('hide_password', 'Hide password') : label('show_password', 'Show password'));
    });
  });
  const feedback = document.getElementById('password-feedback');
  function updateFeedback() {
    if (!feedback || !confirmation) return;
    let key = 'password_hint', fallback = 'Use at least 8 characters.';
    if (passwordInput.value.length >= 8 && confirmation.value) {
      key = passwordInput.value === confirmation.value ? 'password_match' : 'password_mismatch';
      fallback = key === 'password_match' ? 'Passwords match.' : 'Passwords do not match.';
    }
    feedback.textContent = label(key, fallback);
  }
  if (feedback) {
    passwordInput.addEventListener('input', updateFeedback);
    confirmation?.addEventListener('input', updateFeedback);
    document.addEventListener('languagechange', updateFeedback);
    updateFeedback();
  }
  const setStep = code => {
    phoneForm.hidden = code;
    codeForm.hidden = !code;
    (code ? codeInput : phoneInput).focus();
  };
  const action = async (fn, button) => {
    if (busy || button?.disabled) return;
    busy = true;
    const buttons = [...panel.querySelectorAll('button')].map(b => [b, b.disabled]);
    const done = window.FaminaLoading.button(button);
    panel.setAttribute('aria-busy', 'true');
    buttons.forEach(([b]) => b.disabled = true);
    releaseAction = () => {
      buttons.forEach(([b, disabled]) => b.disabled = disabled);
      done(); panel.removeAttribute('aria-busy'); busy = false; leaving = false;
    };
    try {
      await F.ready;
      if (!F.client && F.retryAuth) await F.retryAuth();
      if (!F.client) {
        const local = ['localhost', '127.0.0.1'].includes(location.hostname);
        throw Error(local
          ? message('backend_local', 'The local account service is not connected. Start the configured backend and try again.')
          : message('backend_unavailable', 'The account service is unavailable. Please check your connection and try again.'));
      }
      await fn();
    } catch (error) {
      leaving = false;
      const detail = error.code === 'phone_provider_disabled'
        ? message('phone_disabled', 'Phone registration is not enabled yet. Please contact support.')
        : error.message || message('failed', 'Sign-in failed. Please try again.');
      F.notify(detail, 'error');
    } finally { if (!leaving) releaseAction(); }
  };
  window.addEventListener('pageshow', e => { if (e.persisted) releaseAction(); });
  function normalisePhone(value) {
    const compact = value.trim().replace(/[\s().-]/g, '');
    if (/^\d{8}$/.test(compact)) return '+235' + compact;
    if (/^\+235\d{8}$/.test(compact)) return compact;
    throw Error(message('phone', 'Enter a valid Chad phone number.'));
  }
  async function finish(session) {
    if (!session) throw Error(message('failed', 'Sign-in failed. Please try again.'));
    await F.refreshUser(session);
    if (!F.user) throw Error(message('server', 'Could not verify your account. Please try again.'));
    await F.Cart?.merge();
    leaving = true;
    location.href = 'famipay-app.html';
  }
  function showVerification(phone) {
    sentPhone = phone;
    resendAt = Date.now() + 60000;
    document.getElementById('sent-phone').textContent = phone;
    codeInput.value = '';
    setStep(true);
    F.notify(message('sent', 'Verification code sent.'));
  }
  phoneForm.addEventListener('submit', e => {
    e.preventDefault();
    let phone;
    try {
      phone = normalisePhone(phoneInput.value);
      if (passwordInput.value.length < 8) throw Error(message('password_length', 'Use at least 8 characters for your password.'));
      if (document.body.dataset.authPage === 'register') {
        if (!terms?.checked) throw Error(message('terms_required', 'Please agree to the terms and privacy policy.'));
        if (passwordInput.value !== confirmation?.value) throw Error(message('password_mismatch', 'Passwords do not match.'));
      }
    } catch (error) {
      const field = !/^\+235\d{8}$/.test((phoneInput.value || '').trim().replace(/[\s().-]/g, '').replace(/^(\d{8})$/, '+235$1'))
        ? phoneInput : passwordInput.value.length < 8 ? passwordInput : !terms?.checked ? terms : confirmation;
      field?.setAttribute('aria-invalid', 'true');
      field?.focus();
      F.notify(error.message, 'error'); return;
    }
    action(async () => {
      const password = passwordInput.value;
      if (document.body.dataset.authPage === 'register') {
        recovery = false;
        if (existing) existing.hidden = true;
        const { data, error } = await F.client.auth.signUp({ phone, password, options: { data: { terms_accepted_at: new Date().toISOString(), terms_version: '2026-10' } } });
        if (error) {
          if (['user_already_exists','phone_exists'].includes(error.code) || /already registered|already exists/i.test(error.message || '')) {
            if (existing) existing.hidden = false;
            return;
          }
          throw error;
        }
        if (Array.isArray(data?.user?.identities) && data.user.identities.length === 0) {
          if (existing) existing.hidden = false;
          return;
        }
        passwordInput.value = '';
        if (confirmation) confirmation.value = '';
        if (data?.session) await finish(data.session);
        else if (data?.user) showVerification(phone);
        else throw Error(message('failed', 'Sign-in failed. Please try again.'));
      } else {
        const { data, error } = await F.client.auth.signInWithPassword({ phone, password });
        if (error) throw error;
        passwordInput.value = '';
        await finish(data?.session);
      }
    }, e.submitter || phoneForm.querySelector('[type=submit]'));
  });
  resetButton?.addEventListener('click', e => action(async () => {
    const phone = normalisePhone(phoneInput.value);
    const { error } = await F.client.auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
    if (error) throw error;
    recovery = true;
    showVerification(phone);
  }, e.currentTarget));
  changePhone.addEventListener('click', () => { sentPhone = ''; resendAt = 0; recovery = false; setStep(false); });
  resend.addEventListener('click', e => action(() => {
    if (!sentPhone) throw Error(message('first', 'Request an SMS code first.'));
    if (Date.now() < resendAt) throw Error(message('wait', 'Please wait before requesting another code.'));
    const request = recovery ? F.client.auth.signInWithOtp({ phone: sentPhone, options: { shouldCreateUser: false } }) : F.client.auth.resend({ type: 'sms', phone: sentPhone });
    return request.then(({ error }) => {
      if (error) throw error;
      resendAt = Date.now() + 60000;
      F.notify(message('sent', 'Verification code sent.'));
    });
  }, e.currentTarget));
  codeForm.addEventListener('submit', e => {
    e.preventDefault();
    action(async () => {
      if (!sentPhone) throw Error(message('first', 'Request an SMS code first.'));
      const token = codeInput.value.trim();
      if (!/^\d{6}$/.test(token)) throw Error(message('code', 'Enter the six-digit SMS code.'));
      const { data, error } = await F.client.auth.verifyOtp({ phone: sentPhone, token, type: 'sms' });
      if (error) throw error;
      const session = data?.session || (await F.client.auth.getSession()).data?.session;
      if (!session) throw Error(message('failed', 'Sign-in failed. Please try again.'));
      if (recovery && resetForm) {
        codeForm.hidden = true;
        resetForm.hidden = false;
        document.getElementById('reset-new-password').focus();
      } else await finish(session);
    }, e.submitter || codeForm.querySelector('[type=submit]'));
  });
  resetForm?.addEventListener('submit', e => {
    e.preventDefault();
    action(async () => {
      const password = document.getElementById('reset-new-password').value;
      const confirm = document.getElementById('reset-confirm-password').value;
      if (password.length < 8) throw Error(message('password_length', 'Use at least 8 characters for your password.'));
      if (password !== confirm) throw Error(message('password_mismatch', 'Passwords do not match.'));
      const { error } = await F.client.auth.updateUser({ password });
      if (error) throw error;
      document.getElementById('reset-new-password').value = '';
      document.getElementById('reset-confirm-password').value = '';
      const { data } = await F.client.auth.getSession();
      await finish(data?.session);
    }, e.submitter || resetForm.querySelector('[type=submit]'));
  });
  F.ready.then(() => { if (F.user && !busy) location.href = 'famipay-app.html'; });
})();
