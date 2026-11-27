(() => {
    'use strict';

    const root = document.querySelector('[data-fp-app]');
    if (!root) return;

    const actions = [
        ['Send Money', '↗', 'finance'],
        ['Add Money', '+', 'finance'],
        ['Withdraw', '↓', 'finance'],
        ['Bank Transfer', '▣', 'finance'],
        ['Airtime', '☎', 'finance'],
        ['Mobile Data', '◉', 'finance'],
        ['Pay Bills', '▤', 'finance'],
        ['QR Pay', '▦', 'finance'],
        ['Food Delivery', '♨', 'express'],
        ['Agriculture', '❀', 'express'],
        ['Online Shop', '▧', 'express'],
        ['My Orders', '□', 'express'],
    ];
    const views = [...root.querySelectorAll('.fp-view')];
    const routeStack = [location.hash.slice(1) || 'home'];
    let activeTab = routeStack[0];

    function show(id) {
        const view = views.find(item => item.dataset.fpView === id);
        const activeId = view ? id : 'home';
        if (root.querySelector(`[data-fp-target="${activeId}"]`)) activeTab = activeId;
        views.forEach(item => item.classList.toggle('active', item.dataset.fpView === activeId));
        root.querySelectorAll('.fp-nav a').forEach(link => {
            const selectedTab = activeId === 'service' ? 'services' : activeTab;
            link.setAttribute('aria-current', link.dataset.fpTarget === selectedTab ? 'page' : 'false');
        });
    }

    function navigate(id) {
        const current = location.hash.slice(1) || 'home';
        if (current === id) return show(id);
        if (routeStack[routeStack.length - 1] !== current) routeStack.push(current);
        routeStack.push(id);
        location.hash = id;
    }

    function onRouteChange() {
        const id = location.hash.slice(1) || 'home';
        while (routeStack.length > 1 && routeStack[routeStack.length - 1] !== id) routeStack.pop();
        if (routeStack[routeStack.length - 1] !== id) routeStack.push(id);
        show(id);
    }

    function add(container, filter) {
        actions.filter(action => action[2] === filter).forEach(([label, symbol]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'fp-action';
            const icon = document.createElement('span');
            icon.className = 'fp-symbol';
            icon.textContent = symbol;
            const name = document.createElement('strong');
            name.textContent = label;
            button.append(icon, name);
            button.addEventListener('click', () => open(label));
            container.append(button);
        });
    }

    function open(label) {
        root.querySelector('[data-fp-service-title]').textContent = label;
        root.querySelector('[data-fp-service-description]').textContent =
            ['Food Delivery', 'Agriculture', 'Online Shop', 'My Orders'].includes(label)
                ? 'This service will connect to the existing commerce backend after migration and verification.'
                : 'This financial feature is a UI prototype only. It is not connected to a bank, wallet or mobile-money provider.';
        navigate('service');
    }

    add(root.querySelector('[data-fp-actions]'), 'finance');
    add(root.querySelector('[data-fp-express]'), 'express');
    root.querySelectorAll('[data-fp-target]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            navigate(link.dataset.fpTarget);
        });
    });
    root.querySelector('[data-fp-back]').addEventListener('click', () => {
        if (routeStack.length > 1) history.back();
        else navigate('home');
    });
    window.addEventListener('hashchange', onRouteChange);
    show(routeStack[0]);
    const loader = root.querySelector('[data-fp-loader]');
    if (loader) loader.hidden = true;
})();
