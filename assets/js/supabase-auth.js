(function () {
  const F = window.Famina, panel = document.getElementById('firebase-auth');
  if (!panel || panel.dataset.authInitialized) return;
  panel.dataset.authInitialized = 'true';
  const phoneForm = document.getElementById('phone-form');
  const codeForm = document.getElementById('phone-code-form');
  const phoneInput = document.getElementById('auth-phone');
  const codeInput = document.getElementById('auth-code');
  const resend = document.getElementById('resend-code');
  const changePhone = document.getElementById('change-phone');
  let sentPhone = '', resendAt = 0, busy = false, leaving = false, releaseAction = () => {};
  const message = (key, fallback) => window.i18n?.t('auth.errors.' + key, fallback) || fallback;
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
      if (!F.client) throw Error(message('disabled', 'Phone sign-in is temporarily unavailable.'));
      await fn();
    } catch (error) {
      leaving = false;
      F.notify(error.message || message('failed', 'Sign-in failed. Please try again.'), 'error');
    } finally { if (!leaving) releaseAction(); }
  };
  window.addEventListener('pageshow', e => { if (e.persisted) releaseAction(); });
  function normalisePhone(value) {
    const compact = value.trim().replace(/[\s().-]/g, '');
    if (/^\d{8}$/.test(compact)) return '+235' + compact;
    if (/^\+235\d{8}$/.test(compact)) return compact;
    throw Error(message('phone', 'Enter a valid Chad phone number.'));
  }
  async function send(phone) {
    if (Date.now() < resendAt) throw Error(message('wait', 'Please wait before requesting another code.'));
    const register = document.body.dataset.authPage === 'register';
    const { error } = await F.client.auth.signInWithOtp({ phone, options: { shouldCreateUser: register } });
    if (error) throw error;
    sentPhone = phone;
    resendAt = Date.now() + 60000;
    document.getElementById('sent-phone').textContent = phone;
    codeInput.value = '';
    setStep(true);
    F.notify(message('sent', 'Verification code sent.'));
  }
  phoneForm.addEventListener('submit', e => {
    e.preventDefault();
    action(() => send(normalisePhone(phoneInput.value)), e.submitter || phoneForm.querySelector('[type=submit]'));
  });
  changePhone.addEventListener('click', () => { sentPhone = ''; resendAt = 0; setStep(false); });
  resend.addEventListener('click', e => action(() => {
    if (!sentPhone) throw Error(message('first', 'Request an SMS code first.'));
    return send(sentPhone);
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
      await F.refreshUser(session);
      if (!F.user) throw Error(message('server', 'Could not verify your account. Please try again.'));
      await F.Cart?.merge();
      leaving = true;
      location.href = 'famipay-app.html';
    }, e.submitter || codeForm.querySelector('[type=submit]'));
  });
})();
