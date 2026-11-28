(() => {
    'use strict';

    const screens = [
        {group:'Money',title:'Wallet',id:'wallet'},
        {group:'Cards',title:'My Cards',id:'my-cards'},
        {group:'Money',title:'Add Money',id:'add-money'},
        {group:'Money',title:'Withdraw',id:'withdraw'},
        {group:'Money',title:'Send Money',id:'send-money'},
        {group:'Money',title:'Bank Transfer',id:'bank-transfer'},
        {group:'Money',title:'Mobile Money',id:'mobile-money'},
        {group:'Money',title:'Review Payment',id:'review-payment'},
        {group:'Money',title:'Transaction Receipt',id:'transaction-receipt'},
        {group:'Money',title:'Transaction History',id:'transaction-history'},
        {group:'Payments',title:'Airtime',id:'airtime'},
        {group:'Payments',title:'Mobile Data',id:'mobile-data'},
        {group:'Payments',title:'Pay Bills',id:'pay-bills'},
        {group:'Payments',title:'Bill Details',id:'bill-details'},
        {group:'Payments',title:'QR Payment',id:'qr-payment'},
        {group:'Payments',title:'Receive Money',id:'receive-money'},
        {group:'FA-MINNA Express',title:'Express Home',id:'express-home'},
        {group:'FA-MINNA Express',title:'Restaurants',id:'restaurants'},
        {group:'FA-MINNA Express',title:'Restaurant Menu',id:'restaurant-menu'},
        {group:'FA-MINNA Express',title:'Food Cart',id:'food-cart'},
        {group:'FA-MINNA Express',title:'Food Checkout',id:'food-checkout'},
        {group:'FA-MINNA Express',title:'Track Food Order',id:'track-food-order'},
        {group:'FA-MINNA Express',title:'Agriculture',id:'agriculture'},
        {group:'FA-MINNA Express',title:'Farm Product',id:'farm-product'},
        {group:'FA-MINNA Express',title:'Online Shop',id:'online-shop'},
        {group:'FA-MINNA Express',title:'Product Details',id:'product-details'},
        {group:'FA-MINNA Express',title:'Shop Checkout',id:'shop-checkout'},
        {group:'FA-MINNA Express',title:'My Orders',id:'my-orders'},
        {group:'Account',title:'Notifications',id:'notifications'},
        {group:'Account',title:'My Profile',id:'my-profile'},
        {group:'Account',title:'Settings',id:'settings'},
        {group:'Account',title:'Help Center',id:'help-center'},
        {group:'Merchant',title:'Merchant Registration',id:'merchant-registration'},
        {group:'Merchant',title:'Merchant Dashboard',id:'merchant-dashboard'},
        {group:'Merchant',title:'Merchant QR',id:'merchant-qr'},
        {group:'Merchant',title:'Merchant Orders',id:'merchant-orders'},
        {group:'Merchant',title:'Catalog Management',id:'catalog-management'},
        {group:'Merchant',title:'Refunds',id:'refunds'},
        {group:'Agent',title:'Find Agent',id:'find-agent'},
        {group:'Agent',title:'Agent Dashboard',id:'agent-dashboard'},
        {group:'Agent',title:'Agent Float',id:'agent-float'},
        {group:'Rider',title:'Rider Dashboard',id:'rider-dashboard'},
        {group:'Rider',title:'Delivery Details',id:'delivery-details'},
        {group:'Rider',title:'Delivery Proof',id:'delivery-proof'},
        {group:'Admin',title:'Admin Dashboard',id:'admin-dashboard'},
        {group:'Admin',title:'User Management',id:'user-management'},
        {group:'Admin',title:'KYC Review',id:'kyc-review'},
        {group:'Admin',title:'Payment Exceptions',id:'payment-exceptions'},
        {group:'Admin',title:'Disputes and Fraud',id:'disputes-and-fraud'},
        {group:'Admin',title:'Service Configuration',id:'service-configuration'},
        {group:'Admin',title:'Audit Log',id:'audit-log'},
        {group:'Getting started',title:'Language Selection',id:'language-selection'},
        {group:'Getting started',title:'Onboarding',id:'onboarding'},
        {group:'Getting started',title:'Create Account',id:'create-account'},
        {group:'Getting started',title:'Verify Phone',id:'verify-phone'},
        {group:'Getting started',title:'Identity Verification',id:'identity-verification'},
        {group:'Getting started',title:'Login and PIN',id:'login-and-pin'},
    ];
    const fields = {
        default: ['Reference or name', 'Amount / quantity'],
        'Send Money': ['Recipient phone (+235)', 'Amount (FCFA)'],
        'Bank Transfer': ['Bank', 'Account number', 'Amount (FCFA)'],
        'Mobile Money': ['Operator', 'Phone number', 'Amount (FCFA)'],
        'Food Checkout': ['Delivery address', 'Contact phone', 'Payment method'],
        'Shop Checkout': ['Delivery address', 'Contact phone', 'Payment method'],
        'Farm Product': ['Product unit (kg / bag)', 'Quantity'],
        'Catalog Management': ['Product name', 'Price (FCFA)', 'Quantity'],
        'Identity Verification': ['Full legal name', 'Document type', 'Document reference'],
    };
    const iconPaths = {
        home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
        wallet: 'M3 6h17v15H3V4h15v2M16 12h4v5h-4Z',
        cards: 'M3 6h18v12H3zM3 11h18M7 15h4',
        services: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
        orders: 'm3 7 9-4 9 4v11l-9 4-9-4ZM3 7l9 4 9-4M12 11v11',
        profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
        'send-money': 'm3 10 18-7-7 18-3-8-8-3ZM11 13 21 3',
        'receive-money': 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v10M7 12h10',
        'mobile-money': 'M7 2h10v20H7ZM11 18h2',
        airtime: 'M7 2h10v20H7ZM11 18h2',
        'pay-bills': 'M5 3h14v19l-4-3-3 3-3-3-4 3ZM8 8h8M8 12h8',
        'qr-payment': 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v6h-6v-2',
        restaurants: 'M4 3v7a3 3 0 0 0 6 0V3M7 3v19M20 22V3c-5 0-6 6-6 11h6',
        'online-shop': 'M4 7h16l-1 15H5ZM8 8V6a4 4 0 0 1 8 0v2',
        agriculture: 'M12 22V12M12 16C3 16 3 9 3 5c7 0 9 4 9 11ZM12 12c0-7 4-9 10-9 0 6-3 9-10 9Z',
        eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
        'eye-off': 'm3 3 18 18M10 5c7-1 12 7 12 7l-3 4M6 6l-4 6s4 7 10 7l4-1',
        help: 'M3 13v-1a9 9 0 0 1 18 0v1M3 13h3v6H5a2 2 0 0 1-2-2v-4Zm18 0h-3v6h1a2 2 0 0 0 2-2v-4ZM18 19a6 6 0 0 1-6 3',
        scan: 'M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3M8 8h8v8H8z',
        bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0',
    };
    const screenSymbols = {
        wallet: '◈', 'add-money': '+', withdraw: '↓', 'send-money': '↗',
        'bank-transfer': '⇄', 'mobile-money': '▣', airtime: '☎',
        'mobile-data': '◉', 'pay-bills': '▤', 'qr-payment': '▦',
        restaurants: '♨', agriculture: '❀', 'online-shop': '▧',
        'my-orders': '□', notifications: '♢', 'my-profile': '●',
    };
    const role = window.FAMIPAY_AUTH_ROLE || 'customer';
    const groups = role === 'customer'
        ? ['Getting started', 'Money', 'Cards', 'Payments', 'FA-MINNA Express', 'Account']
        : [role[0].toUpperCase() + role.slice(1), 'Account'];
    const visible = screens.filter(screen => groups.includes(screen.group));
    const byId = Object.fromEntries(visible.map(screen => [screen.id, screen]));
    let previousPrivateRoute = 'home';
    const app = document.getElementById('app');
    const shell = element('div', null, 'app');
    const side = element('aside', null, 'side');
    const main = element('main', null, 'main');
    const bottom = element('nav', null, 'bottom');
    const notificationsPath = byId.notifications ? 'notifications' : 'my-profile';
    const helpPath = byId['help-center'] ? 'help-center' : 'my-profile';
    const qrPath = byId['qr-payment'] ? 'qr-payment' : (byId['merchant-qr'] ? 'merchant-qr' : 'my-profile');
    let unreadCount = 0;
    let avatarUrl = '';
    let balanceHidden = true;

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text !== null) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function firstName() {
        const user = window.Famina?.user || {};
        const name = [user.first_name, user.firstName, user.full_name, user.name, user.display_name, user.user_metadata?.full_name, user.user_metadata?.name].find(value => typeof value === 'string' && value.trim());
        return name ? name.trim().split(/\s+/)[0] : 'there';
    }

    function greeting() {
        const hour = new Date().getHours();
        return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    }

    function svgIcon(name) {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('focusable', 'false');
        icon.classList.add('fp-icon');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', iconPaths[name]);
        icon.append(path);
        return icon;
    }

    function safePhoto(value) {
        try {
            const url = new URL(value);
            return url.protocol === 'https:' ? url.href : '';
        } catch {
            return '';
        }
    }

    function buildHeader() {
        const header = element('header', null, 'fp-app-header');
        const greetingText = element('p', greeting(), 'fp-greeting-period');
        const title = element('h1', `Hi, ${firstName()}`, 'fp-greeting-name');
        const greetingBlock = element('div', null, 'fp-greeting');
        greetingBlock.append(greetingText, title);
        const actions = element('div', null, 'fp-header-actions');
        const profile = element('a', null, 'fp-header-action fp-profile-action');
        profile.href = '#my-profile';
        profile.setAttribute('aria-label', 'Profile');
        profile.title = 'Profile';
        const avatar = element('span', firstName().slice(0, 1).toUpperCase(), 'fp-avatar-fallback');
        if (avatarUrl) {
            const image = document.createElement('img');
            image.src = avatarUrl;
            image.alt = '';
            image.referrerPolicy = 'no-referrer';
            image.addEventListener('error', () => image.replaceWith(avatar), {once: true});
            profile.append(image);
        } else {
            profile.append(avatar);
        }

        const help = linkButton(helpPath, 'Help Center', 'help');
        const scanner = linkButton(qrPath, 'Scan QR code', 'scan');
        const notifications = linkButton(notificationsPath, 'Notifications', 'bell');
        notifications.classList.add('fp-notification-action');
        const badge = element('span', '', 'fp-notification-badge');
        badge.hidden = true;
        badge.setAttribute('aria-hidden', 'true');
        notifications.append(badge);
        actions.append(profile, help, scanner, notifications);
        header.append(greetingBlock, actions);
        return header;
    }

    function linkButton(id, label, icon) {
        const link = element('a', null, 'fp-header-action');
        link.href = `#${id}`;
        link.setAttribute('aria-label', label);
        link.title = label;
        link.append(svgIcon(icon));
        return link;
    }

    function loadProfilePhoto() {
        if (!window.Famina?.client) return;
        window.Famina.client.auth.getSession().then(({data, error}) => {
            if (error) throw error;
            const metadata = data.session?.user?.user_metadata || {};
            avatarUrl = safePhoto(metadata.avatar_url || metadata.picture || '');
            const profile = main.querySelector('.fp-profile-action');
            if (!avatarUrl || !profile) return;
            const image = document.createElement('img');
            image.src = avatarUrl;
            image.alt = '';
            image.referrerPolicy = 'no-referrer';
            image.addEventListener('error', () => {
                image.replaceWith(element('span', firstName().slice(0, 1).toUpperCase(), 'fp-avatar-fallback'));
                avatarUrl = '';
            }, {once: true});
            profile.replaceChildren(image);
        }).catch(error => console.error('Could not load the FAMIPAY profile photo:', error));
    }

    function loadUnreadNotifications() {
        if (!window.Famina?.user) return;
        window.Famina.api('/notifications', {background: true}).then(notifications => {
            if (!Array.isArray(notifications)) throw new TypeError('Invalid notification response.');
            unreadCount = notifications.filter(notification =>
                notification.read_at == null && notification.is_read !== true && notification.read !== true
            ).length;
            updateNotificationBadge();
        }).catch(error => console.error('Could not load the unread notification count:', error));
    }

    function updateNotificationBadge() {
        const badge = main.querySelector('.fp-notification-badge');
        const button = main.querySelector('.fp-notification-action');
        if (!badge || !button) return;
        badge.hidden = unreadCount === 0;
        badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
        button.setAttribute('aria-label', unreadCount
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications');
    }

    const tabRoutes = {
        customer: ['home', 'my-cards', 'express-home', 'my-orders', 'my-profile'],
        merchant: ['home', 'merchant-dashboard', 'catalog-management', 'merchant-orders', 'my-profile'],
        agent: ['home', 'agent-float', 'find-agent', 'agent-dashboard', 'my-profile'],
        rider: ['home', 'rider-dashboard', 'delivery-details', 'delivery-proof', 'my-profile'],
        admin: ['home', 'payment-exceptions', 'service-configuration', 'admin-dashboard', 'my-profile'],
    }[role] || ['home', 'wallet', 'express-home', 'my-orders', 'my-profile'];
    const tabNames = role === 'customer' ? ['Home', 'Cards', 'Services', 'Orders', 'Me'] : ['Home', 'Wallet', 'Services', 'Orders', 'Me'];
    const tabIcons = ['⌂', '◈', '▦', '▤', '●'];

    function getActiveTab(id) {
        const exact = tabRoutes.lastIndexOf(id);
        if (exact >= 0) return exact;
        const group = byId[id]?.group;
        if (group === 'Money') return 1;
        if (['Payments', 'FA-MINNA Express', 'Merchant', 'Agent', 'Rider', 'Admin'].includes(group)) {
            return group === 'Merchant' && id === 'merchant-orders' ? 3 : 2;
        }
        if (group === 'Account') return id === 'notifications' || id === 'help-center' ? 4 : 4;
        return 0;
    }

    const privateRouteStack = [];
    function navigate(id) {
        if (!byId[id] && id !== 'home') return;
        const current = decodeURIComponent(location.hash.slice(1) || 'home');
        if (current === id) return;
        previousPrivateRoute = current;
        privateRouteStack.push(current);
        if (privateRouteStack.length > 30) privateRouteStack.shift();
        location.hash = id;
    }
    function navigateBack() {
        const current = decodeURIComponent(location.hash.slice(1) || 'home');
        let target = privateRouteStack.pop();
        while (target === current && privateRouteStack.length) target = privateRouteStack.pop();
        if (!target || !byId[target]) target = previousPrivateRoute && byId[previousPrivateRoute] && previousPrivateRoute !== current
            ? previousPrivateRoute : (tabRoutes[0] || 'home');
        if (target === current) target = 'home';
        previousPrivateRoute = null;
        location.hash = target;
    }

    function addSideNavigation() {
        side.append(element('div', 'FAMIPAY', 'brand'));
        for (const group of groups) {
            side.append(element('h3', group));
            for (const screen of visible.filter(item => item.group === group)) {
                const link = element('a', screen.title);
                link.href = `#${screen.id}`;
                side.append(link);
            }
        }
    }

    function addBottomNavigation() {
        bottom.setAttribute('aria-label', 'Private application navigation');
        tabRoutes.forEach((id, index) => {
            const link = element('a', null, 'fp-tab');
            link.href = `#${id}`;
            link.dataset.fpTab = String(index);
            const icon = element('span', null, 'fp-tab-icon');
            icon.append(svgIcon((role === 'customer' ? ['home', 'cards', 'services', 'orders', 'profile'] : ['home', 'wallet', 'services', 'orders', 'profile'])[index]));
            link.append(icon, element('span', tabNames[index], 'fp-tab-label'));
            bottom.append(link);
        });
    }

    function card(screen) {
        const button = element('button', null, 'card');
        button.type = 'button';
        button.append(
            element('span', screenSymbols[screen.id] || '•'),
            element('strong', screen.title),
            element('small', screen.group),
        );
        button.onclick = () => navigate(screen.id);
        return button;
    }

    function cards(items) {
        const grid = element('div', null, 'cards');
        items.forEach(item => grid.append(card(item)));
        return grid;
    }

    function translateText(value) {
        return window.i18n?.translateText ? window.i18n.translateText(value) : value;
    }

    function backIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15 18l-6-6 6-6');
        svg.append(path);
        return svg;
    }

    function historyDestination(screenId) {
        if (byId[screenId]?.group === 'Account') return 'notifications';
        if (screenId === 'wallet') return 'transaction-history';
        if (['restaurants', 'agriculture', 'online-shop', 'my-orders'].includes(screenId))
            return 'my-orders';
        return 'transaction-history';
    }

    function buildServiceHeader(screen) {
        const header = element('header', null, 'fp-service-header');
        const back = element('button', null, 'fp-service-back');
        back.type = 'button';
        back.setAttribute('aria-label', translateText('Back'));
        back.append(backIcon());
        back.onclick = () => {
            navigateBack();
        };
        const title = element('h1', translateText(screen.title), 'fp-service-header-title');
        const historyAction = element('button', translateText('History'), 'fp-service-history');
        historyAction.type = 'button';
        historyAction.onclick = () => navigate(historyDestination(screen.id));
        header.append(back, title, historyAction);
        return header;
    }

    function openBottomSheet(title, rows) {
        const old = document.querySelector('.fp-bottom-sheet-backdrop');
        if (old) old.remove();
        const backdrop = element('div', null, 'fp-bottom-sheet-backdrop');
        backdrop.setAttribute('aria-label', translateText('Close'));
        const sheet = element('section', null, 'fp-bottom-sheet');
        sheet.addEventListener('click', event => event.stopPropagation());
        sheet.append(element('div', null, 'fp-sheet-grip'));
        sheet.append(element('h2', translateText(title)));
        rows.forEach(([label, value]) => {
            const row = element('div', null, 'fp-sheet-row');
            row.append(element('span', translateText(label)), element('span', String(value)));
            sheet.append(row);
        });
        backdrop.append(sheet);
        backdrop.onclick = () => backdrop.remove();
        document.body.append(backdrop);
        sheet.querySelector('h2').tabIndex = -1;
        sheet.querySelector('h2').focus();
        return sheet;
    }

    function showSheetStatus(message, state = 'error') {
        const status = document.querySelector('.fp-sheet-status');
        if (!status) return;
        status.textContent = translateText(message);
        status.className = `fp-inline-status ${state}`;
    }

    function providerNames(screenId) {
        if (screenId === 'mobile-money') return ['Airtel Money', 'Moov Money'];
        if (screenId === 'bank-transfer') return ['Bank account'];
        if (screenId === 'pay-bills') return ['Water', 'Electricity', 'Internet'];
        if (screenId === 'airtime' || screenId === 'mobile-data') return ['Airtel', 'Moov'];
        return [];
    }

    function nativeProviderCard(screen) {
        const providers = providerNames(screen.id);
        if (!providers.length) return null;
        const cardNode = element('section', null, 'fp-native-card');
        cardNode.append(element('h2', translateText('Choose provider')));
        const list = element('div', null, 'fp-provider-list');
        let selected = '';
        providers.forEach(provider => {
            const button = element('button', provider, 'fp-provider-option');
            button.type = 'button';
            button.setAttribute('aria-pressed', 'false');
            button.onclick = () => {
                selected = provider;
                list.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
                cardNode.dispatchEvent(new CustomEvent('providerchange', {detail: provider}));
            };
            list.append(button);
        });
        cardNode.append(list);
        cardNode.getSelected = () => selected;
        return cardNode;
    }

    function nativeServiceForm(screen) {
        const formCard = element('section', null, 'fp-native-card');
        const form = element('form');
        form.noValidate = true;
        formCard.append(form);

        const providerCard = nativeProviderCard(screen);
        if (providerCard) formCard.insertAdjacentElement ? formCard.prepend(providerCard) : formCard.append(providerCard);

        const amountIds = ['send-money', 'add-money', 'withdraw', 'mobile-money', 'airtime', 'mobile-data', 'pay-bills'];
        if (amountIds.includes(screen.id)) {
            const amountCard = element('div', null, 'fp-native-card');
            amountCard.append(element('h2', translateText('Amount')));
            const amounts = element('div', null, 'fp-amount-grid');
            let chosenAmount = '';
            [1000, 2500, 5000, 10000].forEach(amount => {
                const button = element('button', amount.toLocaleString() + ' FCFA', 'fp-amount-option');
                button.type = 'button';
                button.setAttribute('aria-pressed', 'false');
                button.onclick = () => {
                    chosenAmount = String(amount);
                    amounts.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
                    customInput.value = chosenAmount;
                    validate();
                };
                amounts.append(button);
            });
            amountCard.append(amounts);
            const customInput = document.createElement('input');
            customInput.type = 'number';
            customInput.inputMode = 'numeric';
            customInput.min = '100';
            customInput.step = '100';
            customInput.name = 'amount';
            customInput.placeholder = translateText('Enter amount (FCFA)');
            customInput.className = 'fp-custom-amount';
            customInput.style.marginTop = '10px';
            customInput.style.width = '100%';
            customInput.style.minHeight = '48px';
            customInput.style.padding = '12px';
            customInput.style.border = '1px solid #cad9d3';
            customInput.style.borderRadius = '10px';
            customInput.addEventListener('input', () => {
                chosenAmount = customInput.value;
                amounts.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', 'false'));
                validate();
            });
            amountCard.append(customInput);
            form.append(amountCard);
            amountCard.getAmount = () => chosenAmount;
        }

        (fields[screen.title] || fields.default).forEach((name, index) => {
            const label = element('label', translateText(name), 'field');
            const input = document.createElement('input');
            input.required = true;
            input.name = 'f' + index;
            input.placeholder = translateText(name);
            if (/phone/i.test(name)) {
                input.type = 'tel';
                input.inputMode = 'tel';
                input.autocomplete = 'tel';
            }
            label.append(input);
            form.append(label);
            input.addEventListener('input', validate);
        });

        const status = element('p', '', 'fp-inline-status');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        const submit = element('button', translateText('Continue'), 'fp-native-primary');
        submit.type = 'submit';
        submit.disabled = true;
        form.append(status, submit);

        function validate() {
            const providerValid = !providerCard || Boolean(providerCard.getSelected());
            const amountValid = !amountIds.includes(screen.id) ||
                (Number(form.elements.amount?.value || 0) >= 100);
            const requiredValid = [...form.querySelectorAll('input[required]')]
                .every(input => input.value.trim().length > 0);
            submit.disabled = !(providerValid && amountValid && requiredValid);
        }
        validate();

        form.addEventListener('submit', event => {
            event.preventDefault();
            if (submit.disabled) return;
            const rows = [];
            [...form.querySelectorAll('input')].forEach(input => {
                if (input.name) rows.push([input.placeholder || input.name, input.value]);
            });
            if (providerCard?.getSelected()) rows.unshift(['Provider', providerCard.getSelected()]);
            // Never imply a payment was submitted when no transaction API is connected.
            const status = form.querySelector('.fp-inline-status');
            if (status) {
                status.textContent = translateText('This transaction is not available until an authorized payment provider is connected. No money was sent.');
                status.className = 'fp-inline-status error';
                status.setAttribute('role', 'alert');
            }
        });

        return formCard;
    }

    function renderWalletStatus(container) {
        const card = element('section', null, 'fp-native-card');
        card.append(
            element('h2', translateText('Wallet')),
            element('p', translateText('No wallet or balance provider is connected to this account.')),
        );
        container.append(card);
    }

    function renderNotifications(container) {
        const loading = element('div', translateText('Loading notifications…'), 'fp-empty-state');
        container.append(loading);
        if (!window.Famina?.api) {
            loading.textContent = translateText('Notifications are unavailable.');
            return;
        }
        window.Famina.api('/notifications', {background: true}).then(items => {
            loading.remove();
            if (!Array.isArray(items) || !items.length) {
                container.append(element('div', translateText('No notifications'), 'fp-empty-state'));
                return;
            }
            items.forEach(item => {
                const row = element('article', null, 'fp-list-row');
                row.append(
                    element('strong', translateText(item.title || item.type || 'Notification')),
                    element('span', translateText(item.message || item.body || '')),
                );
                container.append(row);
            });
        }).catch(() => {
            loading.textContent = translateText('Notifications could not be loaded.');
        });
    }

    function renderOrders(container) {
        const loading = element('div', translateText('Loading orders…'), 'fp-empty-state');
        container.append(loading);
        if (!window.Famina?.api) {
            loading.textContent = translateText('Orders are unavailable.');
            return;
        }
        window.Famina.api('/orders', {background: true}).then(items => {
            loading.remove();
            if (!Array.isArray(items) || !items.length) {
                container.append(element('div', translateText('No orders'), 'fp-empty-state'));
                return;
            }
            items.forEach(order => {
                const row = element('article', null, 'fp-list-row');
                row.append(
                    element('strong', translateText(order.status || 'Order')),
                    element('span', order.id ? '#' + order.id : ''),
                );
                container.append(row);
            });
        }).catch(() => {
            loading.textContent = translateText('Orders could not be loaded.');
        });
    }

    // Customer's primary tabs use a dedicated, compact mobile layout.
    function premiumTitle(container, title, subtitle) {
        const heading = element('div', null, 'fp-premium-heading');
        heading.append(element('h1', translateText(title)), element('p', translateText(subtitle)));
        container.append(heading);
    }

    function premiumAction(container, label, destination, symbol, subtitle = '') {
        if (!byId[destination]) return;
        const button = element('button', null, 'fp-premium-action');
        button.type = 'button';
        const icon = element('span', null, 'fp-premium-action-icon');
        if (iconPaths[symbol]) icon.append(svgIcon(symbol));
        else icon.textContent = symbol;
        const content = element('span', null, 'fp-premium-action-copy');
        content.append(element('strong', translateText(label)));
        if (subtitle) content.append(element('small', translateText(subtitle)));
        button.append(icon, content, element('span', '›', 'fp-premium-chevron'));
        button.onclick = () => navigate(destination);
        container.append(button);
    }

    function premiumService(container, id, label) {
        if (!byId[id]) return;
        const button = element('button', null, 'fp-premium-service');
        button.type = 'button';
        const symbol = element('span', null, 'fp-premium-service-icon');
        if (iconPaths[id]) symbol.append(svgIcon(id));
        else symbol.textContent = screenSymbols[id] || '•';
        button.append(symbol, element('span', translateText(label || byId[id].title)));
        button.onclick = () => navigate(id);
        container.append(button);
    }

    function renderCardsPage(page) {
        premiumTitle(page, 'My Cards', 'Virtual and physical debit cards');
        const switcher = element('div', null, 'fp-cards-switch');
        const content = element('div', null, 'fp-cards-content');
        let type = 'virtual';
        const draw = () => {
            switcher.replaceChildren();
            [['virtual','Virtual Card'],['physical','Physical Card']].forEach(([value,label]) => {
                const button = element('button', translateText(label), 'fp-cards-switch-button' + (type === value ? ' active' : ''));
                button.type = 'button';
                button.setAttribute('aria-pressed', String(type === value));
                button.onclick = () => { type = value; draw(); };
                switcher.append(button);
            });
            content.replaceChildren();
            const card = element('div', null, 'fp-cards-face');
            const top = element('div', null, 'fp-cards-face-top');
            const logo = document.createElement('img');
            logo.src = 'assets/branding/famipay-mark.svg';
            logo.alt = 'FAMIPAY';
            logo.className = 'fp-cards-brand-logo';
            const branding = element('div',null,'fp-cards-brand');
            branding.append(logo,element('strong','FAMIPAY'));
            top.append(branding,element('span',translateText('CARD PREVIEW')));
            card.append(top,element('div','••••  ••••  ••••  ••••','fp-cards-digits'));
            const footer = element('div',null,'fp-cards-face-footer');
            footer.append(element('span',translateText(type === 'virtual' ? 'VIRTUAL CARD' : 'PHYSICAL CARD')),element('span',translateText('NOT ISSUED')));
            card.append(footer);
            content.append(card);
            const disclaimer = element('p',translateText('Illustration only. No card has been issued.'),'fp-cards-disclaimer');
            content.append(disclaimer);
            const info = element('section',null,'fp-cards-info');
            info.append(element('h2',translateText(type === 'virtual' ? 'Virtual Debit Card' : 'Physical ATM Card')));
            info.append(element('p',translateText(type === 'virtual' ? 'For online payments when card issuing becomes available.' : 'For ATM withdrawals and in-store payments when card issuing becomes available.')));
            const button = element('button',translateText('Request ' + (type === 'virtual' ? 'Virtual' : 'Physical') + ' Card'),'fp-cards-request');
            button.type = 'button';
            button.onclick = () => {
                const existing = info.querySelector('.fp-cards-feedback');
                if (existing) existing.remove();
                info.append(element('p',translateText('Card issuing is not yet available. No request has been submitted.'),'fp-cards-feedback'));
            };
            info.append(button);
            content.append(info);
            const management = element('section',null,'fp-cards-management');
            management.append(element('h2',translateText('Card Management')));
            const disabled = [['Card Security','Freeze and manage issued cards'],['Card Transactions','Payments made with your cards']];
            disabled.forEach(([label,description]) => {
                const row = element('div',null,'fp-cards-management-row');
                row.append(element('strong',translateText(label)),element('small',translateText(description + ' · Available after issuance')));
                management.append(row);
            });
            premiumAction(management,'Card Support','help-center','help','Get assistance');
            content.append(management);
        };
        page.append(switcher,content);
        draw();
    }

    function premiumCustomerPage(screenId) {
        const page = element('div', null, 'fp-premium-page');
        if (screenId === 'my-cards') {
            renderCardsPage(page);
        } else if (screenId === 'wallet') {
            premiumTitle(page, 'My Wallet', 'Your money, in one place');
            const hero = element('section', null, 'fp-premium-wallet-hero');
            hero.append(element('p', translateText('Available Balance')));
            const amount = element('strong', '******', 'fp-premium-wallet-amount');
            const toggle = element('button', null, 'fp-premium-visibility');
            toggle.type = 'button';
            const update = () => {
                amount.textContent = balanceHidden ? '******' : translateText('Wallet not connected');
                toggle.replaceChildren(svgIcon(balanceHidden ? 'eye-off' : 'eye'));
                toggle.setAttribute('aria-label', translateText(balanceHidden ? 'Show balance' : 'Hide balance'));
            };
            toggle.onclick = () => { balanceHidden = !balanceHidden; update(); };
            update();
            const balanceRow = element('div', null, 'fp-premium-balance-row');
            balanceRow.append(amount, toggle);
            hero.append(balanceRow, element('span', translateText('FCFA · FAMIPAY Wallet'), 'fp-premium-wallet-caption'));
            const actions = element('div', null, 'fp-premium-wallet-buttons');
            [['Add Money','add-money'], ['Transfer','send-money'], ['Withdraw','withdraw']].forEach(([label,id]) => {
                const button = element('button', translateText(label));
                button.type = 'button';
                button.onclick = () => navigate(id);
                actions.append(button);
            });
            hero.append(actions);
            page.append(hero);
            page.append(element('h2', translateText('Recent Activity'), 'fp-premium-section-title'));
            const empty = element('div', null, 'fp-premium-empty');
            empty.append(element('strong', translateText('No transactions yet')), element('p', translateText('Your wallet activity will appear here when a provider is connected.')));
            page.append(empty);
            const links = element('section', null, 'fp-premium-list');
            premiumAction(links, 'Transaction History', 'transaction-history', 'wallet', 'View your wallet activity');
            premiumAction(links, 'Bank Transfer', 'bank-transfer', 'send-money', 'Transfer to a bank account');
            page.append(links);
        } else if (screenId === 'express-home') {
            premiumTitle(page, 'Services', 'Everything you need, in one place');
            const search = document.createElement('input');
            search.type = 'search';
            search.className = 'fp-premium-search';
            search.placeholder = translateText('Search services');
            search.setAttribute('aria-label', translateText('Search services'));
            page.append(search);
            const catalog = element('div', null, 'fp-premium-catalog');
            const sections = [
                ['Money & Transfers', [['send-money','Send Money'],['receive-money','Receive Money'],['mobile-money','Mobile Money'],['bank-transfer','Bank Transfer'],['withdraw','Withdraw'],['qr-payment','QR Payment']]],
                ['Bills & Payments', [['airtime','Airtime'],['mobile-data','Mobile Data'],['pay-bills','Pay Bills']]],
                ['Shopping & Lifestyle', [['restaurants','Food Delivery'],['online-shop','Online Shop'],['agriculture','Agriculture']]],
            ];
            const tabs = element('div', null, 'fp-premium-filters');
            const filters = ['All','Money','Payments','Lifestyle'];
            let activeFilter = 'All';
            const updateCatalog = () => {
                catalog.replaceChildren();
                sections.forEach(([title,items],index) => {
                    if (activeFilter !== 'All' && ['Money','Payments','Lifestyle'][index] !== activeFilter) return;
                    const filtered = items.filter(([id,label]) => (label + ' ' + byId[id]?.title).toLowerCase().includes(search.value.trim().toLowerCase()));
                    if (!filtered.length) return;
                    catalog.append(element('h2', translateText(title), 'fp-premium-section-title'));
                    const grid = element('div', null, 'fp-premium-service-grid');
                    filtered.forEach(([id,label]) => premiumService(grid,id,label));
                    catalog.append(grid);
                });
                if (!catalog.childElementCount) catalog.append(element('p', translateText('No matching services.'), 'fp-premium-empty'));
                [...tabs.children].forEach(button => button.classList.toggle('selected', button.dataset.filter === activeFilter));
            };
            filters.forEach(label => {
                const button = element('button', translateText(label));
                button.type = 'button';
                button.dataset.filter = label;
                button.onclick = () => { activeFilter = label; updateCatalog(); };
                tabs.append(button);
            });
            search.addEventListener('input', updateCatalog);
            page.append(tabs,catalog);
            updateCatalog();
        } else if (screenId === 'my-orders') {
            premiumTitle(page, 'My Orders', 'Track your deliveries and purchases');
            const tabs = element('div', null, 'fp-premium-filters');
            const content = element('div', null, 'fp-premium-orders');
            const filters = ['All','Active','Completed'];
            let selected = 'All';
            let orders = null;
            const paint = () => {
                content.replaceChildren();
                const filtered = (orders || []).filter(order => {
                    const status = String(order.status || '').toLowerCase();
                    const completed = ['delivered','completed','cancelled','canceled','refunded'].includes(status);
                    return selected === 'All' || (selected === 'Completed' ? completed : !completed);
                });
                if (!orders) {
                    content.append(element('p', translateText('Loading orders…'), 'fp-premium-empty'));
                } else if (!filtered.length) {
                    const empty = element('section', null, 'fp-premium-empty fp-premium-orders-empty');
                    empty.append(element('span', '◇', 'fp-premium-empty-icon'), element('strong', translateText(selected === 'All' ? 'No orders yet' : 'No ' + selected.toLowerCase() + ' orders')), element('p', translateText('Your food, shopping and delivery orders will appear here.')));
                    const browse = element('button', translateText('Explore Services'), 'fp-premium-cta');
                    browse.onclick = () => navigate('express-home');
                    empty.append(browse);
                    content.append(empty);
                } else {
                    filtered.forEach(order => {
                        const card = element('article', null, 'fp-premium-order-card');
                        const head = element('div', null, 'fp-premium-order-head');
                        head.append(element('strong', translateText('Order') + (order.id ? ' #' + String(order.id).slice(0,8) : '')), element('span', translateText(order.status || 'Pending'), 'fp-premium-order-status'));
                        card.append(head);
                        if (order.created_at) card.append(element('small', new Date(order.created_at).toLocaleDateString(), 'fp-premium-order-date'));
                        content.append(card);
                    });
                }
            };
            filters.forEach(label => {
                const button = element('button', translateText(label));
                button.type = 'button';
                button.dataset.filter = label;
                button.onclick = () => { selected = label; paint(); [...tabs.children].forEach(item => item.classList.toggle('selected',item === button)); };
                if (label === 'All') button.classList.add('selected');
                tabs.append(button);
            });
            page.append(tabs,content);
            paint();
            if (window.Famina?.api) window.Famina.api('/orders', {background:true}).then(data => {
                if (!page.isConnected) return;
                orders = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : [];
                paint();
            }).catch(() => {
                if (!page.isConnected) return;
                content.replaceChildren(element('p', translateText('Orders could not be loaded. Please try again.'), 'fp-premium-empty'));
            });
            else { orders = []; paint(); }
        } else if (screenId === 'my-profile') {
            premiumTitle(page, 'My Account', 'Your personal FAMIPAY space');
            const user = window.Famina?.user || {};
            const profile = element('section', null, 'fp-premium-profile');
            const avatar = element('span', String(user.name || user.email || 'F').trim().charAt(0).toUpperCase(), 'fp-premium-profile-avatar');
            const info = element('div', null, 'fp-premium-profile-info');
            info.append(element('strong', user.name || translateText('FAMIPAY User')), element('small', user.email || user.phone || translateText('Personal Account')));
            profile.append(avatar, info);
            page.append(profile);
            page.append(element('h2', translateText('Account & Security'), 'fp-premium-section-title'));
            const account = element('section', null, 'fp-premium-list');
            const details = element('div', null, 'fp-premium-account-details');
            details.append(element('strong', translateText('Personal information')));
            if (user.name) details.append(element('p', user.name));
            if (user.email) details.append(element('p', user.email));
            if (user.phone) details.append(element('p', user.phone));
            account.append(details);
            premiumAction(account,'Settings & Language','settings','services','Preferences and languages');
            premiumAction(account,'Notifications','notifications','bell','Alerts and updates');
            page.append(account);
            page.append(element('h2', translateText('Support'), 'fp-premium-section-title'));
            const support = element('section', null, 'fp-premium-list');
            premiumAction(support,'Help Center','help-center','help','Get assistance');
            page.append(support);
        }
        main.append(page);
    }


    // Purpose-built service screens. Preserve the existing visual language and route shell.
    function renderServiceContent(screen, container) {
        const id = screen.id;
        const section = (title, description) => {
            const card = element('section', null, 'fp-native-card');
            card.append(element('h2', translateText(title)));
            if (description) card.append(element('p', translateText(description)));
            container.append(card);
            return card;
        };
        const action = (card, label, destination) => {
            if (!byId[destination]) return;
            const button = element('button', translateText(label), 'fp-native-primary');
            button.type = 'button';
            button.onclick = () => navigate(destination);
            card.append(button);
        };
        const info = (title, description, links = []) => {
            const card = section(title, description);
            links.forEach(([label, destination]) => action(card, label, destination));
        };
        const listings = {
            restaurants: ['/restaurants', 'Restaurants', 'restaurant-menu'],
            'restaurant-menu': ['/restaurants', 'Restaurant menu', 'food-cart'],
            agriculture: ['/products?category=agriculture', 'Agricultural products', 'farm-product'],
            'farm-product': ['/products?category=agriculture', 'Product details', 'shop-checkout'],
            'online-shop': ['/products', 'Shop products', 'product-details'],
            'product-details': ['/products', 'Product details', 'shop-checkout'],
            'catalog-management': ['/products', 'Catalog', 'product-details'],
        };
        if (listings[id]) {
            const [endpoint, title, next] = listings[id];
            const card = section(title, 'Available items are loaded from the connected service.');
            const status = element('p', translateText('Loading available items…'), 'fp-inline-status');
            card.append(status);
            if (!window.Famina?.api) {
                status.textContent = translateText('Service connection unavailable.');
                return;
            }
            window.Famina.api(endpoint, {background: true}).then(result => {
                if (!card.isConnected) return;
                const items = Array.isArray(result) ? result :
                    (Array.isArray(result?.items) ? result.items :
                    (Array.isArray(result?.products) ? result.products :
                    (Array.isArray(result?.restaurants) ? result.restaurants : [])));
                status.textContent = items.length ? '' : translateText('No published items available.');
                items.slice(0, 60).forEach(item => {
                    const row = element('article', null, 'fp-list-row');
                    const name = String(item.name || item.title || item.restaurant_name || 'Item');
                    row.append(element('strong', name));
                    if (item.price != null) row.append(element('span', String(item.price) + ' FCFA'));
                    if (item.description) row.append(element('p', String(item.description).slice(0, 180)));
                    // Detail routes require an item identifier; do not open an unrelated item.
                    if (item.id && byId[next]) {
                        const button = element('button', translateText('View details'), 'fp-native-primary');
                        button.type = 'button';
                        button.onclick = () => {
                            sessionStorage.setItem('famipay-selected-item', JSON.stringify({id:item.id,name,price:item.price ?? null}));
                            navigate(next);
                        };
                        row.append(button);
                    }
                    card.append(row);
                });
            }).catch(() => {
                if (card.isConnected) status.textContent = translateText('Could not load available items. Please try again.');
            });
            return;
        }
        if (['food-cart','food-checkout','track-food-order','shop-checkout','delivery-details','delivery-proof'].includes(id)) {
            const selected = (() => { try { return JSON.parse(sessionStorage.getItem('famipay-selected-item') || 'null'); } catch { return null; } })();
            if (id === 'track-food-order' || id === 'delivery-details') {
                info('Delivery tracking', 'Your verified order status and delivery information appear in My Orders.', [['View My Orders','my-orders']]);
            } else if (id === 'delivery-proof') {
                info('Delivery confirmation', 'Delivery proof is available only for an assigned, verified delivery.');
            } else if (id === 'food-cart') {
                info('Your food cart', 'Your selected restaurant items appear here. No items have been added.', [['Browse restaurants','restaurants']]);
            } else if (id === 'food-checkout' || id === 'shop-checkout') {
                info('Checkout', selected ? 'Selected: ' + selected.name + '. Checkout requires a verified cart, delivery address and payment integration.' :
                    'Select an available product before checkout.', [[id === 'food-checkout' ? 'Browse restaurants' : 'Browse shop',id === 'food-checkout' ? 'restaurants' : 'online-shop']]);
            }
            return;
        }
        if (['transaction-history','transaction-receipt','review-payment','bill-details'].includes(id)) {
            info(screen.title, 'Verified payment details will appear here after a successful transaction. No payment has been recorded.');
            return;
        }
        if (id === 'receive-money') {
            info('Receive money', 'Your verified receiving account and QR code will appear when your wallet provider is connected.', [['QR Payment','qr-payment']]);
            return;
        }
        if (id === 'help-center') {
            info('Help Center', 'For assistance with your account, orders or payments, use the official FAMIPAY support contact. Never share your password or verification code.');
            return;
        }
        if (id === 'my-profile') {
            const user = window.Famina?.user || {};
            const card = section('Account information', 'Your verified account details.');
            [['Name',user.name],['Email',user.email],['Phone',user.phone],['Role',user.role]].forEach(([label,value]) => {
                if (value) card.append(element('p', translateText(label) + ': ' + String(value)));
            });
            action(card, 'Settings', 'settings');
            return;
        }
        if (['merchant-dashboard','agent-dashboard','rider-dashboard','admin-dashboard'].includes(id)) {
            const destinations = {
                'merchant-dashboard': [['Orders','merchant-orders'],['Catalog','catalog-management'],['Merchant QR','merchant-qr'],['Refunds','refunds']],
                'agent-dashboard': [['Agent Float','agent-float'],['Find Agent','find-agent']],
                'rider-dashboard': [['Delivery Details','delivery-details'],['Delivery Proof','delivery-proof']],
                'admin-dashboard': [['User Management','user-management'],['KYC Review','kyc-review'],['Payment Exceptions','payment-exceptions'],['Disputes and Fraud','disputes-and-fraud'],['Service Configuration','service-configuration'],['Audit Log','audit-log']],
            };
            info(screen.title, 'Manage your assigned operations.', destinations[id]);
            return;
        }
        if (['merchant-orders','refunds','agent-float','user-management','kyc-review','payment-exceptions','disputes-and-fraud','audit-log'].includes(id)) {
            info(screen.title, 'Records will appear when they are available from your authorized account service.');
            return;
        }
        if (['language-selection','onboarding','create-account','verify-phone','identity-verification','login-and-pin'].includes(id)) {
            info(screen.title, 'Account registration and verification are managed by the secure sign-in and onboarding flow.');
            return;
        }
        container.append(nativeServiceForm(screen));
    }

    function render() {
        const id = decodeURIComponent(location.hash.slice(1) || 'home');
        const screenId = byId[id] ? id : (id === 'home' ? 'home' : 'home');
        const isPrimary = screenId === 'home' || tabRoutes.includes(screenId);
        shell.classList.toggle('fp-service-focused', !isPrimary);
        shell.classList.toggle('fp-dashboard-home', screenId === 'home' && role === 'customer');
        bottom.hidden = !isPrimary;
        main.replaceChildren();

        if (screenId === 'home' && role === 'customer') {
            const dashboard = element('section', null, 'fp-classic-dashboard');
            const masthead = element('div', null, 'fp-classic-masthead');
            const heading = element('div');
            heading.append(
                element('p', greeting() + ',', 'fp-classic-greeting'),
                element('h1', firstName(), 'fp-classic-name'),
            );
            const notifications = linkButton(notificationsPath, 'Notifications', 'bell');
            notifications.classList.add('fp-notification-action');
            const badge = element('span', '', 'fp-notification-badge');
            badge.hidden = true;
            notifications.append(badge);
            const actions = element('div', null, 'fp-classic-actions');
            actions.append(linkButton(helpPath, 'Help Center', 'help'), linkButton(qrPath, 'Scan QR code', 'scan'), notifications);
            masthead.append(heading, actions);
            const balance = element('section', null, 'fp-classic-balance');
            const balanceTop = element('div', null, 'fp-classic-balance-top');
            balanceTop.append(
                element('span', translateText('Available Balance')),
                element('span', translateText('Wallet not connected')),
            );
            const balanceBottom = element('div', null, 'fp-classic-balance-bottom');
            const balanceValue = element('strong', null, 'fp-classic-balance-value');
            const visibility = element('button', null, 'fp-balance-visibility');
            visibility.type = 'button';
            const updateBalance = () => {
                // There is no wallet provider in this application yet. Never invent a balance.
                balanceValue.textContent = balanceHidden ? '******' : translateText('Wallet not connected');
                visibility.setAttribute('aria-label', balanceHidden ? 'Show balance' : 'Hide balance');
                visibility.setAttribute('aria-pressed', String(!balanceHidden));
                visibility.replaceChildren(svgIcon(balanceHidden ? 'eye-off' : 'eye'));
            };
            visibility.onclick = () => { balanceHidden = !balanceHidden; updateBalance(); };
            updateBalance();
            balanceTop.firstChild.append(visibility);
            balanceBottom.append(balanceValue);
            const addMoney = element('button', translateText('Add Money'), 'fp-classic-add-money');
            addMoney.type = 'button';
            addMoney.onclick = () => navigate('add-money');
            balanceBottom.append(addMoney);
            balance.append(balanceTop, balanceBottom);
            dashboard.append(masthead, balance);
            main.append(dashboard);
            main.append(element('h2', translateText('Quick Services'), 'fp-classic-quick-title'));
            const quick = ['send-money', 'receive-money', 'mobile-money', 'airtime', 'pay-bills', 'qr-payment'];
            const more = ['restaurants', 'online-shop', 'agriculture'];
            const quickGrid = cards(quick.map(id => byId[id]).filter(Boolean));
            quickGrid.classList.add('fp-classic-grid');
            main.append(quickGrid);
            main.append(element('h2', translateText('More Services'), 'fp-classic-more-title'));
            const moreGrid = cards(more.map(id => byId[id]).filter(Boolean));
            moreGrid.classList.add('fp-classic-grid');
            main.append(moreGrid);
            for (const button of main.querySelectorAll('.fp-classic-grid .card')) {
                const id = [...quick, ...more].find(id => byId[id]?.title === button.querySelector('strong').textContent);
                if (id) button.firstChild.replaceChildren(svgIcon(id));
            }
        } else if (screenId === 'home') {
            main.append(buildHeader());
            const walletHeader = element('section', null, 'fp-wallet-overview');
            walletHeader.append(element('div', translateText('Available balance'), 'fp-balance-label'));
            const hero = element('div', null, 'hero');
            hero.append(element('h2', '— FCFA'), element('p', translateText('Wallet not connected')));
            walletHeader.append(hero);
            main.append(walletHeader);
            for (const group of groups.filter(item => !['Getting started', 'Account'].includes(item))) {
                main.append(element('h2', translateText(group), 'fp-section-title'));
                const grid = cards(visible.filter(item => item.group === group));
                grid.classList.add('fp-service-grid');
                main.append(grid);
            }
            main.append(element('div', translateText('Financial actions require an authorized provider or existing backend service.'), 'warning'));
        } else if (isPrimary && role === 'customer' && ['my-cards','express-home','my-orders','my-profile'].includes(screenId)) {
            premiumCustomerPage(screenId);
        } else if (isPrimary) {
            main.append(buildHeader());
            const screen = byId[screenId];
            main.append(element('h1', translateText(screen?.title || 'Service')));
            if (screenId === 'notifications') {
                renderNotifications(main);
            } else if (screenId === 'my-orders' || screenId === 'merchant-orders') {
                renderOrders(main);
            } else if (screenId === 'wallet' || screenId === 'transaction-history') {
                renderWalletStatus(main);
            } else if (screenId === 'settings') {
                const preferences = element('section', null, 'panel');
                preferences.append(element('h2', translateText('Language preferences')));
                const languageSettings = element('div');
                languageSettings.dataset.fpLanguageSettings = '';
                preferences.append(languageSettings);
                main.append(preferences);
            } else {
                renderServiceContent(screen || byId['wallet'], main);
            }
        } else {
            const screen = byId[screenId];
            main.append(buildServiceHeader(screen));
            const scroll = element('div', null, 'fp-service-scroll');
            if (screenId === 'notifications') {
                renderNotifications(scroll);
            } else if (screenId === 'my-orders' || screenId === 'merchant-orders') {
                renderOrders(scroll);
            } else if (screenId === 'wallet' || screenId === 'transaction-history') {
                renderWalletStatus(scroll);
            } else if (screenId === 'settings') {
                const preferences = element('section', null, 'fp-native-card');
                preferences.append(element('h2', translateText('Language preferences')));
                const languageSettings = element('div');
                languageSettings.dataset.fpLanguageSettings = '';
                preferences.append(languageSettings);
                scroll.append(preferences);
            } else {
                renderServiceContent(screen, scroll);
            }
            main.append(scroll);
        }
        side.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === `#${screenId}`));
        bottom.querySelectorAll('a').forEach(link => {
            link.setAttribute('aria-current', Number(link.dataset.fpTab) === getActiveTab(screenId) ? 'page' : 'false');
        });
        updateNotificationBadge();
        document.title = (byId[screenId]?.title || 'Home') + ' · FAMIPAY';
        window.scrollTo({top: 0, behavior: 'instant'});
    }

    addSideNavigation();
    addBottomNavigation();
    shell.append(side, main, bottom);
    app.replaceChildren(shell);
    window.addEventListener('hashchange', render);
    render();
    loadProfilePhoto();
    loadUnreadNotifications();
})();
