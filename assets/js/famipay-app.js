(() => {
    'use strict';

    const screens = [
        {group:'Money',title:'Wallet',id:'wallet'},
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
        ? ['Getting started', 'Money', 'Payments', 'FA-MINNA Express', 'Account']
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

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text !== null) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function firstName() {
        return String(window.Famina?.user?.name || '').trim().split(/\s+/)[0] || 'there';
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
        customer: ['home', 'wallet', 'express-home', 'my-orders', 'my-profile'],
        merchant: ['home', 'merchant-dashboard', 'catalog-management', 'merchant-orders', 'my-profile'],
        agent: ['home', 'agent-float', 'find-agent', 'agent-dashboard', 'my-profile'],
        rider: ['home', 'rider-dashboard', 'delivery-details', 'delivery-proof', 'my-profile'],
        admin: ['home', 'payment-exceptions', 'service-configuration', 'admin-dashboard', 'my-profile'],
    }[role] || ['home', 'wallet', 'express-home', 'my-orders', 'my-profile'];
    const tabNames = ['Home', 'Wallet', 'Services', 'Orders', 'Me'];
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

    function navigate(id) {
        const current = decodeURIComponent(location.hash.slice(1) || 'home');
        if (current !== id) previousPrivateRoute = current;
        location.hash = id;
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
            link.append(element('span', tabIcons[index], 'fp-tab-icon'), element('span', tabNames[index], 'fp-tab-label'));
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
            navigate(previousPrivateRoute || tabRoutes[0] || 'home');
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
            openBottomSheet(screen.title + ' preview', rows);
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

    function render() {
        const id = decodeURIComponent(location.hash.slice(1) || 'home');
        const screenId = byId[id] ? id : (id === 'home' ? 'home' : 'home');
        const isPrimary = screenId === 'home' || tabRoutes.includes(screenId);
        shell.classList.toggle('fp-service-focused', !isPrimary);
        bottom.hidden = !isPrimary;
        main.replaceChildren();

        if (screenId === 'home') {
            main.append(buildHeader());
            const walletHeader = element('section', null, 'fp-wallet-overview');
            walletHeader.append(element('div', translateText('Available balance'), 'fp-balance-label'));
            const hero = element('div', null, 'hero');
            hero.append(
                element('h2', '— FCFA'),
                element('p', translateText('Wallet not connected')),
            );
            walletHeader.append(hero);
            main.append(walletHeader);
            for (const group of groups.filter(item => !['Getting started', 'Account'].includes(item))) {
                main.append(element('h2', translateText(group), 'fp-section-title'));
                const grid = cards(visible.filter(item => item.group === group));
                grid.classList.add('fp-service-grid');
                main.append(grid);
            }
            main.append(element('div', translateText('Financial actions require an authorized provider or existing backend service.'), 'warning'));
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
                main.append(nativeServiceForm(screen || byId['wallet']));
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
                scroll.append(nativeServiceForm(screen));
            }
            main.append(scroll);
        }
        side.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === `#${screenId}`));
        bottom.querySelectorAll('a').forEach(link => {
            link.setAttribute('aria-current', Number(link.dataset.fpTab) === getActiveTab(screenId) ? 'page' : 'false');
        });
        updateNotificationBadge();
        document.title = (byId[screenId]?.title || 'Home') + ' · FAMIPAY';
        window.scrollTo(0, 0);
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
