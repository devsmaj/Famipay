(() => {
    'use strict';

    const select = document.querySelector('.fp-language');
    if (!select) return;
    select.remove();

    const observer = new MutationObserver(attach);
    function attach() {
        const host = document.querySelector('[data-fp-language-settings]');
        if (!host) return;

        const label = document.createElement('label');
        label.className = 'fp-language-setting';
        label.textContent = 'Language';
        label.append(select);
        host.replaceChildren(label);
        document.body.classList.add('fp-language-ready');
        observer.disconnect();
    }

    attach();
    if (!document.body.classList.contains('fp-language-ready')) {
        observer.observe(document.body, {childList: true, subtree: true});
    }
})();
