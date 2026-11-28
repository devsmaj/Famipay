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
        {group:'Account',title:'Profile Details',id:'profile-details'},
        {group:'Account',title:'Profile Photo',id:'profile-photo'},
        {group:'Account',title:'Edit Profile Field',id:'profile-edit'},
        {group:'Account',title:'Edit Address',id:'profile-address'},
        {group:'Account',title:'Account Limits',id:'account-limits'},
        {group:'Account',title:'Settings',id:'settings'},
        {group:'Account',title:"Payment Settings",id:'settings-payment-settings'},
        {group:'Account',title:"Login Settings",id:'settings-login-settings'},
        {group:'Account',title:"Savings Settings",id:'settings-savings-settings'},
        {group:'Account',title:"Homepage Settings",id:'settings-homepage-settings'},
        {group:'Account',title:"Security Questions",id:'settings-security-questions'},
        {group:'Account',title:"SMS Alert Settings",id:'settings-sms-alert-settings'},
        {group:'Account',title:"Security Plus",id:'settings-security-plus'},
        {group:'Account',title:"Access to Clipboard",id:'settings-access-to-clipboard'},
        {group:'Account',title:"Themes",id:'settings-themes'},
        {group:'Account',title:"Security Center",id:'settings-security-center'},
        {group:'Account',title:"Feedback and Suggestions",id:'settings-feedback-and-suggestions'},
        {group:'Account',title:"Close Account",id:'settings-close-account'},
        {group:'Account',title:"About",id:'settings-about'},
        {group:'Account',title:"Change Payment PIN",id:'settings-change-payment-pin'},
        {group:'Account',title:"Forgot Payment PIN",id:'settings-forgot-payment-pin'},
        {group:'Account',title:"Manage Virtual Card PIN",id:'settings-manage-virtual-card-pin'},
        {group:'Account',title:"Change Password",id:'settings-change-password'},
        {group:'Account',title:"Forgot Password",id:'settings-forgot-password'},
        {group:'Account',title:"Auto-logout Setting",id:'settings-auto-logout-setting'},
        {group:'Account',title:"Set Up Pattern",id:'settings-set-up-pattern'},
        {group:'Account',title:"Trusted Devices",id:'settings-trusted-devices'},
        {group:'Account',title:"Login Activity",id:'settings-login-activity'},
        {group:'Account',title:"Home Shortcuts",id:'settings-home-shortcuts'},
        {group:'Account',title:"Dashboard Layout",id:'settings-dashboard-layout'},
        {group:'Account',title:"Savings Preferences",id:'settings-savings-preferences'},
        {group:'Account',title:"Savings History",id:'settings-savings-history'},
        {group:'Account',title:"Terms & Conditions",id:'settings-terms-conditions'},
        {group:'Account',title:"Privacy Policy",id:'settings-privacy-policy'},
        {group:'Account',title:"Version Information",id:'settings-version-information'},
        {group:'Account',title:"Request Account Closure",id:'settings-request-account-closure'},
        {group:'Account',title:'Invitation',id:'invitation'},
        {group:'Account',title:'Support Topic',id:'support-topic'},
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
        shield: 'M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6ZM8 12l3 3 5-6',
        gauge: 'M3 18a9 9 0 1 1 18 0ZM12 13l4-5',
        receipt: 'M5 3h14v18l-4-3-3 3-3-3-4 3ZM8 8h8M8 12h8',
        gift: 'M3 8h18v4H3ZM5 12v9h14v-9M12 8v13M12 8C2 8 6-2 12 8M12 8c10 0 6-10 0 0',
        gear: 'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
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


    // Account pages: show verified account data only; never synthesize an account tier or number.
    function accountMetadata() {
        return window.Famina?.client?.auth?.getUser ? window.Famina.client.auth.getUser() : Promise.resolve({data:{user:null}});
    }
    function profileAvatar(sizeClass = '') {
        const wrap = element('span', null, 'fp-me-avatar ' + sizeClass);
        const initial = element('span', firstName().charAt(0).toUpperCase() || 'F');
        const url = safePhoto(avatarUrl || window.Famina?.user?.avatar_url || '');
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Profile photo';
            img.onerror = () => img.replaceWith(initial);
            wrap.append(img);
        } else wrap.append(initial);
        return wrap;
    }
    function meRow(parent, label, destination, icon, hint='') {
        const button = element('button', null, 'fp-me-row');
        button.type = 'button';
        const left = element('span', null, 'fp-me-row-left');
        if (iconPaths[icon]) left.append(svgIcon(icon));
        left.append(element('span', translateText(label)));
        button.append(left); if(hint)button.append(element('small',translateText(hint),'fp-me-hint')); button.append(element('span', '›', 'fp-me-arrow'));
        button.onclick = () => navigate(destination);
        parent.append(button);
    }
    function renderMePage(page) {
        page.classList.add('fp-me-page');
        const user = window.Famina?.user || {};
        const heading = element('div', null, 'fp-me-top');
        const help = element('button', null, 'fp-me-top-icon');
        help.type = 'button'; help.setAttribute('aria-label', 'Help Center');
        help.append(svgIcon('help')); help.onclick = () => navigate('help-center');
        const settings = element('button', null, 'fp-me-top-icon');
        settings.type = 'button'; settings.setAttribute('aria-label', 'Settings');
        settings.append(svgIcon('gear')); settings.onclick = () => navigate('settings');
        heading.append(help,settings);
        page.append(heading);
        const hero = element('button', null, 'fp-me-identity');
        hero.type = 'button';
        hero.append(profileAvatar());
        const person = element('span',null,'fp-me-identity-copy');
        person.append(element('strong',user.nickname || user.name?.trim().split(/\\s+/)[0] || firstName()));
        person.append(element('small', translateText('View my profile') + ' ›'));
        hero.append(person,element('span','›','fp-me-arrow'));
        hero.onclick = () => navigate('profile-details');
        page.append(hero);
        const balance = element('section',null,'fp-me-balance');
        const balanceLine = element('div',null,'fp-me-balance-line');
        balanceLine.append(element('span',translateText('Total Balance')));
        const hidden = element('strong','****');
        const eye = element('button',null,'fp-me-eye'); eye.type='button';
        eye.append(svgIcon('eye-off')); eye.setAttribute('aria-label','Show wallet status');
        let masked=true;
        eye.onclick=()=>{masked=!masked;hidden.textContent=masked?'****':translateText('Wallet not connected');eye.replaceChildren(svgIcon(masked?'eye-off':'eye'));};
        balanceLine.append(eye,hidden);
        balance.append(balanceLine,element('p',translateText('Earned Today') + ' —'));
        page.append(balance);
        const shortcuts = element('section',null,'fp-me-shortcuts');
        [['Transactions','transaction-history','receipt'],['Account Limits','account-limits','gauge'],['Security Center','settings','shield']].forEach(([label,destination,icon])=>{
            const button=element('button',null,'fp-me-shortcut');button.type='button';
            const badge=element('span',null,'fp-me-shortcut-icon');
            if(iconPaths[icon])badge.append(svgIcon(icon));
            button.append(badge,element('span',translateText(label)));
            button.onclick=()=>navigate(destination);
            shortcuts.append(button);
        });
        page.append(shortcuts);
        const menu=element('section',null,'fp-me-menu');
        meRow(menu,'Bank Card / Account','my-cards','cards');
        meRow(menu,'Notifications','notifications','bell');
        page.append(menu);
        const assistant=element('section',null,'fp-me-assistant-card');
        const title=element('button',translateText('FAMIPAY Support Assistant')+' ›','fp-me-assistant');
        title.type='button';title.onclick=()=>navigate('help-center');assistant.append(title);
        const topics=element('div',null,'fp-me-support-topics');
        ['Successful but not credited','Erroneous Transfer','Internet Fraud','Account Theft'].forEach(topic=>{
            const b=element('button',translateText(topic));b.type='button';b.onclick=()=>{supportTopic=topic;navigate('support-topic');};topics.append(b);
        });assistant.append(topics);page.append(assistant);
        const invite=element('section',null,'fp-me-menu');meRow(invite,'Invitation','invitation','gift','Invite friends');page.append(invite);
        const account=element('section',null,'fp-me-menu');meRow(account,'Profile Info','profile-details','profile','Name / ID');meRow(account,'Settings','settings','gear','Security & Language');page.append(account);
        appendSignOut(page);
    }
    let supportTopic='';
    function appendSignOut(page){
        const b=element('button',translateText('Sign Out'),'fp-me-signout');b.type='button';b.onclick=()=>confirmSignOut();page.append(b);
    }
    function confirmSignOut(){
        const dialog=document.createElement('dialog');dialog.className='fp-me-logout-dialog';
        dialog.append(element('p',translateText('Are you sure to log out of FAMIPAY?')));
        const actions=element('div',null,'fp-me-logout-actions');
        const no=element('button',translateText('No'));const yes=element('button',translateText('Yes'));
        no.type=yes.type='button';no.onclick=()=>dialog.close();
        const feedback=element('p',null,'fp-me-editor-feedback');
        yes.onclick=async()=>{
            no.disabled=yes.disabled=true;
            try{
                const client=window.Famina?.client;if(!client?.auth?.signOut)throw Error('Authentication unavailable');
                const {error}=await client.auth.signOut();if(error)throw error;
                window.FaminaSession?.clear();location.replace('login.html');
            }catch(error){feedback.textContent=translateText('Unable to sign out. Please try again.');no.disabled=yes.disabled=false;}
        };
        actions.append(no,yes);dialog.append(actions,feedback);dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
    }
    const settingsGroups = [
        [['My Profile','profile-details','profile'],['Payment Settings','settings-payment-settings','shield'],['Login Settings','settings-login-settings','gear'],['Savings Settings','settings-savings-settings','wallet']],
        [['Homepage Settings','settings-homepage-settings','home'],['Security Questions','settings-security-questions','shield'],['SMS Alert Settings','settings-sms-alert-settings','bell'],['Security Plus','settings-security-plus','shield'],['Access to Clipboard','settings-access-to-clipboard','receipt'],['Themes','settings-themes','gear']],
        [['Security Center','settings-security-center','shield'],['Feedback and Suggestions','settings-feedback-and-suggestions','receipt']],
        [['Close Account','settings-close-account','shield']],
        [['About','settings-about','help']]
    ];
    const settingsSections = {
        'Payment Settings':[['Payment PIN','Change Payment PIN','Forgot Payment PIN'],['Biometrics','Pay with Fingerprint'],['Card Payment','Manage Virtual Card PIN']],
        'Login Settings':[['Password','Change Password','Forgot Password','Auto-logout Setting'],['Pattern','Set Up Pattern'],['Biometrics','Log in with Fingerprint']],
        'Savings Settings':[['Savings','Savings Preferences','Savings History']],
        'Homepage Settings':[['Homepage','Home Shortcuts','Dashboard Layout']],
        'Security Center':[['Security','Security Questions','Login Settings','Payment Settings','Trusted Devices']],
        'Security Plus':[['Protection','Trusted Devices','Login Activity']],
        'Access to Clipboard':[['Privacy','Clipboard Access']],
        'Close Account':[['Account','Request Account Closure']]
    };
    function settingsRow(container,label,target,icon){
        const button=element('button',null,'fp-settings-row');
        button.type='button';
        if(icon && iconPaths[icon])button.append(svgIcon(icon));
        button.append(element('span',translateText(label)),element('span','›','fp-settings-chevron'));
        button.onclick=()=>navigate(target||'settings-'+label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''));
        container.append(button);
    }
    function settingsCard(page,rows){
        const card=element('section',null,'fp-settings-card');
        rows.forEach(([label,target,icon])=>settingsRow(card,label,target,icon));
        page.append(card);
    }
    function renderMeSettings(page){
        page.classList.add('fp-me-details','fp-settings-page');
        profileBackHeader(page,'Settings');
        settingsGroups.forEach(group=>settingsCard(page,group));
        const signout=element('button',translateText('Sign Out'),'fp-settings-signout');
        signout.type='button';
        signout.onclick=()=>{ const overlay=element('div',null,'fp-settings-overlay');const dialog=element('div',null,'fp-settings-dialog');dialog.append(element('p',translateText('Are you sure you want to log out of FAMIPAY?')));const actions=element('div',null,'fp-settings-actions');const no=element('button',translateText('No'));const yes=element('button',translateText('Yes'));no.onclick=()=>overlay.remove();yes.onclick=async()=>{yes.disabled=true;try{const client=window.Famina?.client;if(!client?.auth?.signOut)throw Error('Sign out unavailable');const result=await client.auth.signOut();if(result?.error)throw result.error;location.replace('login.html');}catch(error){yes.disabled=false;dialog.append(element('p',error.message||'Unable to sign out'));}};actions.append(no,yes);dialog.append(actions);overlay.append(dialog);page.append(overlay);};
        page.append(signout);
    }
    function renderSettingsDetail(page,title){
        page.classList.add('fp-me-details','fp-settings-page');
        profileBackHeader(page,title);
        const sections=settingsSections[title];
        if(sections){
            sections.forEach(([heading,...items])=>{
                page.append(element('h3',translateText(heading),'fp-settings-heading'));
                const card=element('section',null,'fp-settings-card');
                items.forEach(item=>{
                    if(['Pay with Fingerprint','Log in with Fingerprint','Clipboard Access'].includes(item)){
                        const line=element('div',null,'fp-settings-row');line.append(element('span',translateText(item)));
                        line.append(element('small',translateText('Unavailable until device security is connected')));card.append(line);
                    }else settingsRow(card,item);
                });page.append(card);
            });return;
        }
        if(title==='Themes'){
            const current=localStorage.getItem('famipay-theme-preference')||'Light Mode';
            ['Light Mode','Dark Mode','System Default'].forEach(option=>{
                const button=element('button',null,'fp-settings-theme'+(current===option?' selected':''));
                button.append(element('span',translateText(option)),element('span',current===option?'✓':'○'));
                button.onclick=()=>{localStorage.setItem('famipay-theme-preference',option);render();};
                page.append(button);
            });return;
        }
        if(title==='SMS Alert Settings'){
            const card=element('section',null,'fp-settings-card fp-settings-question');
            const options=[['sms_credit','Credit Alerts'],['sms_card','Card Transaction Alerts'],['sms_transfer','Transfer & Withdrawal Alerts'],['sms_other','Other Alerts']];
            const inputs={};
            options.forEach(([key,label])=>{
                const row=element('label',null,'fp-settings-row');
                const input=document.createElement('input');input.type='checkbox';input.disabled=true;inputs[key]=input;
                row.append(element('span',translateText(label)),input);card.append(row);
            });
            const consent=element('label',null,'fp-settings-row');
            const agree=document.createElement('input');agree.type='checkbox';agree.disabled=true;
            consent.append(agree,element('span',translateText('I agree to receive the selected SMS notifications. Any provider charges will be disclosed before activation.')));
            card.append(consent);
            const status=element('p','Loading preferences…','fp-settings-note');status.setAttribute('role','status');
            const save=element('button',translateText('Save preferences'),'fp-me-save');save.type='button';save.disabled=true;
            card.append(status,save);page.append(card);
            (async()=>{
                try{
                    const client=window.Famina?.client;
                    const {data:{user},error:authError}=await client.auth.getUser();
                    if(authError||!user)throw authError||new Error('Sign in required');
                    const {data,error}=await client.from('famipay_user_settings').select('sms_credit,sms_card,sms_transfer,sms_other,sms_consent_at').eq('user_id',user.id).maybeSingle();
                    if(error)throw error;
                    options.forEach(([key])=>{inputs[key].checked=!!data?.[key];inputs[key].disabled=false;});
                    agree.checked=!!data?.sms_consent_at;agree.disabled=false;
                    save.disabled=false;status.textContent='Preferences are saved to your account. SMS delivery is not active until a provider is connected.';
                    save.onclick=async()=>{
                        const selected=options.some(([key])=>inputs[key].checked);
                        if(selected&&!agree.checked){status.textContent='Please accept SMS consent before saving selected alerts.';return;}
                        save.disabled=true;save.setAttribute('aria-busy','true');status.textContent='Saving…';
                        try{
                            const payload={user_id:user.id,sms_consent_at:selected?new Date().toISOString():null,updated_at:new Date().toISOString()};
                            options.forEach(([key])=>payload[key]=inputs[key].checked);
                            const {error:writeError}=await client.from('famipay_user_settings').upsert(payload,{onConflict:'user_id'});
                            if(writeError)throw writeError;
                            status.textContent='Preferences saved. SMS delivery is not active until a provider is connected.';
                        }catch(e){status.textContent=e?.message||'Unable to save preferences.';}
                        finally{save.disabled=false;save.setAttribute('aria-busy','false');}
                    };
                }catch(e){status.textContent=e?.message||'Unable to load preferences. Apply the Supabase migration first.';}
            })();
            return;
        }
        if(title==='Change Password'){
            const card=element('section',null,'fp-settings-card fp-settings-question');
            const password=document.createElement('input');password.type='password';password.autocomplete='new-password';password.minLength=8;password.placeholder='New password (at least 8 characters)';
            const confirm=document.createElement('input');confirm.type='password';confirm.autocomplete='new-password';confirm.placeholder='Confirm new password';
            const status=element('p','','fp-settings-note');status.setAttribute('role','alert');
            const save=element('button',translateText('Change Password'),'fp-me-save');save.type='button';
            save.onclick=async()=>{
                if(password.value.length<8){status.textContent='Use at least 8 characters.';return;}
                if(password.value!==confirm.value){status.textContent='Passwords do not match.';return;}
                save.disabled=true;save.setAttribute('aria-busy','true');status.textContent='Updating password…';
                try{
                    const client=window.Famina?.client;
                    const {error}=await client.auth.updateUser({password:password.value});
                    if(error)throw error;
                    password.value='';confirm.value='';status.textContent='Password updated successfully.';
                }catch(e){status.textContent=e?.message||'Unable to change password. Please sign in again.';}
                finally{save.disabled=false;save.setAttribute('aria-busy','false');}
            };
            card.append(password,confirm,status,save);page.append(card);return;
        }
        if(title==='Forgot Password'){
            const card=element('section',null,'fp-settings-card fp-settings-question');
            card.append(element('p','Send a password reset link to your verified email address.','fp-settings-note'));
            const status=element('p','','fp-settings-note');status.setAttribute('role','status');
            const send=element('button','Send reset email','fp-me-save');send.type='button';
            send.onclick=async()=>{
                send.disabled=true;status.textContent='Sending…';
                try{
                    const client=window.Famina?.client;
                    const {data:{user},error:authError}=await client.auth.getUser();
                    if(authError||!user?.email)throw new Error('No verified email is available for password recovery.');
                    const {error}=await client.auth.resetPasswordForEmail(user.email,{redirectTo:new URL('login.html',location.href).href});
                    if(error)throw error;status.textContent='Check your email for the reset link.';
                }catch(e){status.textContent=e?.message||'Could not send reset email.';}
                finally{send.disabled=false;}
            };
            card.append(status,send);page.append(card);return;
        }
        if(title==='Security Questions'){
            page.append(element('h2',translateText('Set up security questions')));
            page.append(element('p',translateText('Protect your account from unauthorized access'),'fp-settings-note'));
            const prompts=["What is your mother's first name?","When was your mother born?","What is the name of your primary school?"];
            prompts.forEach((question,index)=>{
                const card=element('section',null,'fp-settings-card fp-settings-question');
                card.append(element('h3','Question '+(index+1)));
                const select=document.createElement('select');
                [question,'In what city were you born?','What was the name of your first teacher?'].forEach(q=>{const option=element('option',q);select.append(option);});
                const input=document.createElement('input');input.type=index===1?'date':'password';input.placeholder='Enter answer';input.autocomplete='off';
                card.append(select,input);page.append(card);
            });
            page.append(element('p',translateText('Secure enrollment is not yet available; answers are not stored.'),'fp-settings-note'));return;
        }
        if(title==='About'){
            const brand=element('h2','FAMIPAY','fp-settings-brand');page.append(brand);
            settingsCard(page,[['Terms & Conditions','settings-terms-conditions','receipt'],['Privacy Policy','settings-privacy-policy','shield']]);
            settingsCard(page,[['Version Information','settings-version-information','help']]);return;
        }
        if(title==='Feedback and Suggestions'){
            const card=element('section',null,'fp-settings-card fp-settings-question');
            const input=document.createElement('textarea');input.placeholder='Tell us how we can improve FAMIPAY';input.rows=5;card.append(input);
            const status=element('p','','fp-settings-note');status.setAttribute('role','status');
            const send=element('button',translateText('Send feedback'),'fp-me-save');send.type='button';
            send.onclick=async()=>{
                const message=input.value.trim();
                if(message.length<10||message.length>2000){status.textContent='Please enter 10 to 2000 characters.';return;}
                send.disabled=true;send.setAttribute('aria-busy','true');status.textContent='Sending…';
                try{
                    const client=window.Famina?.client;
                    const {data:{user},error:authError}=await client.auth.getUser();
                    if(authError||!user)throw authError||new Error('Sign in required');
                    const {error}=await client.from('famipay_feedback').insert({user_id:user.id,message});
                    if(error)throw error;
                    input.value='';status.textContent='Feedback received. Thank you.';
                }catch(e){status.textContent=e?.message||'Unable to submit feedback.';}
                finally{send.disabled=false;send.setAttribute('aria-busy','false');}
            };
            card.append(status,send);page.append(card);return;
        }
        if(title==='Auto-logout Setting'){
            const card=element('section',null,'fp-settings-card fp-settings-question');
            card.append(element('p',translateText('Choose an inactivity timeout')));
            ['5 minutes','15 minutes','30 minutes'].forEach(label=>{const row=element('label',null,'fp-settings-row');const input=document.createElement('input');input.type='radio';input.name='fp-timeout';row.append(input,element('span',label));card.append(row);});
            page.append(card);return;
        }
        if(title==='Terms & Conditions'||title==='Privacy Policy'){
            const link=element('a',translateText('Open '+title),'fp-settings-document');
            link.href=title==='Privacy Policy'?'privacy.html':'terms.html';page.append(link);return;
        }
        const panel=element('section',null,'fp-settings-card fp-settings-question');
        panel.append(element('h3',translateText(title)));
        panel.append(element('p',translateText('This feature requires a secure connected service before changes can be saved.'),'fp-settings-note'));
        page.append(panel);
    }

    function profileBackHeader(page,title) {
        const header=element('div',null,'fp-me-subheader');
        const back=element('button','‹','fp-me-back');
        back.type='button';back.setAttribute('aria-label','Back');
        back.onclick=()=>navigateBack();
        header.append(back,element('span',translateText(title)));
        page.append(header);
    }
    function renderProfileDetails(page) {
        page.classList.add('fp-me-details');
        profileBackHeader(page,'My Profile');
        const user=window.Famina?.user || {};
        const card=element('section',null,'fp-me-details-card');
        const portrait=element('button',null,'fp-me-portrait');
        portrait.type='button';portrait.setAttribute('aria-label','Change profile photo');
        portrait.append(profileAvatar('fp-me-avatar-large'));
        const camera=element('span',null,'fp-me-camera');camera.append(svgIcon('profile'));
        portrait.append(camera);portrait.onclick=()=>navigate('profile-photo');
        card.append(portrait,element('strong',user.nickname || firstName()));
        const account=element('div',null,'fp-me-account-info');
        const phone=user.phone || '';
        // The local Chad number is a wallet alias only after Supabase confirms ownership.
        // Never treat an unverified phone or an arbitrary metadata flag as a wallet account.
        const localChadPhone = value => {
            const digits=String(value || '').replace(/[^0-9]/g,'');
            if (/^235[0-9]{8}$/.test(digits)) return digits.slice(3);
            if (/^[0-9]{8}$/.test(digits)) return digits;
            return '';
        };
        const accountRow=element('div',null,'fp-me-field');
        const accountValue=element('button',translateText('Verify phone to activate'),'fp-me-verify-phone');
        accountValue.type='button';
        accountValue.onclick=()=>{
            const client=window.Famina?.client;
            const overlay=element('div',null,'fp-phone-overlay');
            const panel=element('section',null,'fp-phone-panel');
            panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Verify phone number');
            const heading=element('h2','Verify your phone');
            const info=element('p','Enter your Chad mobile number to receive a verification code by SMS. SMS delivery must be enabled in Supabase.');
            const number=document.createElement('input');number.type='tel';number.inputMode='tel';number.autocomplete='tel';number.placeholder='8-digit phone number';number.value=localChadPhone(phone);
            number.setAttribute('aria-label','Chad mobile number');
            const code=document.createElement('input');code.type='text';code.inputMode='numeric';code.autocomplete='one-time-code';code.placeholder='SMS verification code';code.setAttribute('aria-label','SMS verification code');code.hidden=true;
            const status=element('p',null,'fp-phone-status');status.setAttribute('role','status');
            const send=element('button','Send verification code','fp-phone-submit');
            const confirm=element('button','Verify code','fp-phone-submit');confirm.hidden=true;
            const cancel=element('button','Cancel','fp-phone-cancel');
            const close=()=>overlay.remove();cancel.onclick=close;
            overlay.onclick=e=>{if(e.target===overlay)close();};
            const busy=(button,on)=>{button.disabled=on;button.replaceChildren();if(on){const spinner=element('span',null,'fp-button-spinner');button.append(spinner);}else button.textContent=button===send?'Send verification code':'Verify code';};
            send.onclick=async()=>{
                const local=localChadPhone(number.value);
                if(!local){status.textContent='Enter a valid 8-digit Chad mobile number.';return;}
                if(!client?.auth?.updateUser){status.textContent='Phone verification is not available. Please try again later.';return;}
                busy(send,true);status.textContent='';
                try{
                    const {error}=await client.auth.updateUser({phone:'+235'+local});
                    if(error)throw error;
                    number.disabled=true;send.hidden=true;code.hidden=false;confirm.hidden=false;
                    status.textContent='Code requested. Enter the SMS code to verify your number.';
                }catch(e){status.textContent=e?.message||'Unable to send verification SMS.';}
                finally{busy(send,false);}
            };
            confirm.onclick=async()=>{
                if(!code.value.trim()){status.textContent='Enter the code from your SMS.';return;}
                busy(confirm,true);status.textContent='';
                try{
                    const {error}=await client.auth.verifyOtp({phone:'+235'+localChadPhone(number.value),token:code.value.trim(),type:'phone_change'});
                    if(error)throw error;
                    close();navigate('profile-info');
                }catch(e){status.textContent=e?.message||'Phone verification failed.';}
                finally{busy(confirm,false);}
            };
            panel.append(heading,info,number,code,status,send,confirm,cancel);overlay.append(panel);document.body.append(overlay);number.focus();
        };
        const accountActions=element('span',null,'fp-me-account-actions');
        accountActions.append(accountValue);
        accountRow.append(element('span',translateText('FAMIPAY Account')),accountActions);
        account.append(accountRow);
        const authClient=window.Famina?.client;
        if (authClient?.auth?.getUser) {
            authClient.auth.getUser().then(({data,error})=>{
                if(error || !page.isConnected) return;
                const verified=data?.user;
                const local=localChadPhone(verified?.phone);
                if(!verified?.phone_confirmed_at || !local) return;
                accountValue.textContent=local;
                const copy=document.createElement('button');
                copy.type='button';
                copy.className='fp-me-copy-icon';
                copy.setAttribute('aria-label','Copy FAMIPAY account number');
                copy.title='Copy account number';
                copy.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
                copy.onclick=async()=>{
                    try {
                        if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(local);
                        else {
                            const field=document.createElement('textarea');field.value=local;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();
                            const ok=document.execCommand('copy');field.remove();if(!ok) throw new Error('Copy unavailable');
                        }
                        copy.setAttribute('aria-label','Account number copied');
                        copy.title='Copied';
                    } catch (_) { copy.title='Unable to copy. Please select the number.'; }
                };
                accountActions.append(copy);
            }).catch(()=>{});
        }
        const level=element('div',null,'fp-me-field');
        const tierButton=element('button',translateText('View Account Limits')+' ›','fp-me-tier-link');tierButton.type='button';tierButton.onclick=()=>navigate('account-limits');level.append(element('span',translateText('Account Level')),tierButton);
        account.append(level);card.append(account);page.append(card);
        const fields=element('section',null,'fp-me-fields');
        const metadata = user.user_metadata || {};
        const values=[
            ['Full Name',user.name || metadata.full_name || '',null],
            ['Mobile Number',localChadPhone(phone) || phone,null],
            ['Nickname',metadata.nickname || user.nickname || '', 'nickname'],
            ['Gender',metadata.gender || '', 'gender'],
            ['Date of Birth',metadata.date_of_birth || '', 'date_of_birth'],
            ['Email',user.email || '', 'email'],
            ['Address',metadata.address || '', 'address']
        ];
        values.forEach(([label,value,key])=>{
            const row=element(key?'button':'div',null,'fp-me-field'+(key?' fp-me-field-editable':''));
            if(key)row.type='button';
            row.append(element('span',translateText(label)),element('span',value || translateText('Not set')));
            if(key){row.append(element('span','›','fp-me-arrow'));row.onclick=()=>{profileEditField=key;navigate(key==='address'?'profile-address':'profile-edit');};}
            fields.append(row);
        });
        page.append(fields);
    }
    let profileEditField = 'nickname';
    function renderProfileEditor(page,key,label,oldValue) {
        page.classList.add('fp-me-photo-page','fp-me-edit-screen');
        profileBackHeader(page,'Edit '+label);
        const panel=element('section',null,'fp-me-editor');
        const header=element('div',null,'fp-me-editor-heading');
        header.append(element('h2',translateText('Edit')+' '+translateText(label)));
        const close=element('button','×');close.type='button';close.setAttribute('aria-label','Close editor');
        close.onclick=()=>navigateBack();header.append(close);panel.append(header);
        let input;
        if(key==='gender'){
            input=document.createElement('select');
            [['','Select gender'],['Male','Male'],['Female','Female'],['Prefer not to say','Prefer not to say']].forEach(([v,t])=>{const option=document.createElement('option');option.value=v;option.textContent=translateText(t);input.append(option);});
        } else {
            input=document.createElement('input');
            input.type=key==='date_of_birth'?'date':key==='email'?'email':'text';
            if(key==='date_of_birth')input.max=new Date().toISOString().slice(0,10);
            if(key==='nickname')input.maxLength=50;
            if(key==='address')input.maxLength=250;
        }
        input.value=oldValue || '';input.setAttribute('aria-label',label);panel.append(input);
        const feedback=element('div',null,'fp-me-form-feedback');
        feedback.setAttribute('role','alert');
        feedback.setAttribute('aria-live','polite');
        const showFeedback=(message,type='error')=>{
            feedback.textContent=translateText(message);
            feedback.dataset.state=type;
            feedback.hidden=!message;
        };
        feedback.hidden=true;
        const save=element('button',translateText('Save changes'),'fp-me-save');
        save.type='button';
        const buttonLabel=element('span',translateText('Save changes'),'fp-me-save-label');
        const spinner=element('span',null,'fp-me-button-spinner');
        spinner.setAttribute('aria-hidden','true');
        save.replaceChildren(buttonLabel,spinner);
        const setBusy=busy=>{
            save.disabled=busy;
            save.setAttribute('aria-busy',String(busy));
            save.classList.toggle('fp-me-saving',busy);
            buttonLabel.textContent=busy?translateText('Saving…'):translateText('Save changes');
        };
        input.addEventListener('input',()=>showFeedback(''));
        save.onclick=async()=>{
            const value=input.value.trim();
            if(!value){showFeedback('Please enter a value.');input.focus();return;}
            if(key==='email'&&!input.checkValidity()){showFeedback('Enter a valid email address.');input.focus();return;}
            const client=window.Famina?.client;
            if(!client?.auth?.updateUser){showFeedback('Account updates are unavailable.');return;}
            showFeedback('');
            setBusy(true);
            try{
                const payload=key==='email'?{email:value}:{data:{[key]:value}};
                const {error}=await client.auth.updateUser(payload);
                if(error)throw error;
                if(key!=='email'){
                    if(window.Famina?.user){
                        window.Famina.user.user_metadata={...(window.Famina.user.user_metadata||{}),[key]:value};
                        if(key==='nickname')window.Famina.user.nickname=value;
                    }
                    navigate('profile-details');
                } else {
                    showFeedback('Check your email to confirm the address change.','success');
                }
            }catch(error){showFeedback(error?.message||'Could not save changes.');}
            finally{setBusy(false);}
        };
        panel.prepend(feedback);
        panel.append(save);page.append(panel);
    }
    const chadProvinces = ["Batha","Borkou","Chari-Baguirmi","Ennedi-Est","Ennedi-Ouest","Guéra","Hadjer-Lamis","Kanem","Lac","Logone Occidental","Logone Oriental","Mandoul","Mayo-Kebbi Est","Mayo-Kebbi Ouest","Moyen-Chari","N'Djamena","Ouaddaï","Salamat","Sila","Tandjilé","Tibesti","Wadi Fira","Barh El Gazel"];
    function renderAddressPage(page) {
        page.classList.add('fp-me-photo-page','fp-me-address-page');
        profileBackHeader(page,'Edit Address');
        const form=element('form',null,'fp-me-address-form');
        form.append(element('h2',translateText('Please fill in your current address')));
        const metadata=window.Famina?.user?.user_metadata||{};
        const fields={};
        function field(label,key,kind='text',options=[]) {
            const group=element('label',null,'fp-me-address-group');
            group.append(element('span',translateText(label)));
            const input=document.createElement(kind==='select'?'select':'input');
            input.name=key;input.required=key!=='landmark';
            if(kind==='select'){
                const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=translateText('Select province');input.append(placeholder);
                options.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;input.append(option);});
            } else {input.type='text';input.maxLength=200;input.placeholder=translateText('Enter '+label.toLowerCase());}
            input.value=metadata['address_'+key]||'';
            fields[key]=input;group.append(input);form.append(group);
        }
        field('Province','province','select',chadProvinces);
        field('Department / Commune','department');
        field('Area / District','area');
        field('Landmark','landmark');
        field('Address','address');
        const feedback=element('p',null,'fp-me-editor-feedback');
        const save=element('button',translateText('Save'),'fp-me-save fp-me-address-save');save.type='submit';
        form.append(feedback,save);
        form.onsubmit=async event=>{
            event.preventDefault();
            if(!form.reportValidity())return;
            const client=window.Famina?.client;
            if(!client?.auth?.updateUser){feedback.textContent=translateText('Account updates are unavailable.');return;}
            const data={};Object.entries(fields).forEach(([key,input])=>data['address_'+key]=input.value.trim());
            data.address=[data.address_address,data.address_area,data.address_department,data.address_province].filter(Boolean).join(', ');
            save.disabled=true;feedback.textContent=translateText('Saving…');
            try{
                const {error}=await client.auth.updateUser({data});if(error)throw error;
                if(window.Famina?.user)window.Famina.user.user_metadata={...(window.Famina.user.user_metadata||{}),...data};
                navigate('profile-details');
            }catch(error){feedback.textContent=error?.message||translateText('Could not save changes.');}
            finally{save.disabled=false;}
        };
        page.append(form);
    }
    function renderAccountLimits(page) {
        page.classList.add('fp-me-details','fp-me-limits-page');
        profileBackHeader(page,'Account Limits');
        const user=window.Famina?.user||{};
        const metadata=user.user_metadata||{};
        const tier=metadata.account_tier ?? metadata.kyc_tier ?? null;
        const verified=tier!==null&&tier!==undefined&&String(tier).trim()!=='';
        const info=element('section',null,'fp-me-limit-info');
        info.append(element('span',translateText('Account Info')));
        info.append(element('strong',user.phone||translateText('Account number unavailable')));
        info.append(element('span',user.name||metadata.full_name||firstName()));
        if(verified)info.append(element('span',translateText('Tier')+' '+String(tier),'fp-me-limit-tier'));
        page.append(info);
        const id=element('section',null,'fp-me-limit-section');
        id.append(element('strong',translateText('Linked ID')),element('p',translateText('Identity verification details are provided by your verified account provider.')));
        page.append(id);
        const limits=element('section',null,'fp-me-limit-section');
        limits.append(element('strong',translateText('Daily Transaction Limit')));
        const amount=metadata.daily_transaction_limit;
        limits.append(element('p',amount!=null?String(amount)+' XAF':translateText('Not available until account limits are verified.')));
        page.append(limits);
        const benefits=element('section',null,'fp-me-limit-section');
        benefits.append(element('strong',translateText('Level Benefits')));
        const table=document.createElement('table');table.className='fp-me-limits-table';
        const head=document.createElement('tr');
        ['Tier','Daily transaction limit','Maximum account balance'].forEach(label=>{const th=document.createElement('th');th.textContent=translateText(label);head.append(th);});table.append(head);
        [0,1,2,3].forEach(level=>{
            const tr=document.createElement('tr');
            const cell=document.createElement('td');cell.textContent='Tier '+level+(verified&&Number(tier)===level?' · Current':'');tr.append(cell);
            ['daily_limit','balance_limit'].forEach(type=>{
                const td=document.createElement('td');const value=metadata['tier_'+level+'_'+type];
                td.textContent=value!=null?String(value)+' XAF':'—';tr.append(td);
            });table.append(tr);
        });
        benefits.append(table);
        benefits.append(element('p',translateText('Limits are displayed only when supplied by your verified account provider.')));
        page.append(benefits);
    }
    function privateToast(message, isError = false) {
        let toast = document.querySelector('.fp-private-toast');
        if (!toast) {
            toast = element('div', null, 'fp-private-toast');
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.append(toast);
        }
        toast.textContent = translateText(message);
        toast.classList.toggle('fp-private-toast-error', isError);
        toast.classList.add('fp-private-toast-visible');
        clearTimeout(privateToast.timer);
        privateToast.timer = setTimeout(() => toast.classList.remove('fp-private-toast-visible'), 4200);
    }

    function renderProfilePhoto(page) {
        page.classList.add('fp-me-photo-page');
        profileBackHeader(page, 'Photo');
        const center = element('div', null, 'fp-me-photo-center');
        const avatar = profileAvatar('fp-me-photo-preview');
        center.append(avatar);
        page.append(center);
        const controls = element('div', null, 'fp-me-photo-controls');
        const picker = element('div', null, 'fp-photo-picker');
        picker.hidden = true;
        const crop = element('div', null, 'fp-photo-crop');
        const photo = document.createElement('img');
        photo.alt = 'Move and zoom your selected profile picture';
        photo.draggable = false;
        crop.append(photo);
        ['tl','tr','bl','br'].forEach(corner => crop.append(element('span', null, 'fp-photo-corner fp-photo-corner-' + corner)));
        const instructions = element('p', 'Drag to position · Pinch or use the slider to zoom', 'fp-photo-instructions');
        const zoom = document.createElement('input');
        zoom.type = 'range'; zoom.min = '1'; zoom.max = '4'; zoom.step = '0.01'; zoom.value = '1';
        zoom.setAttribute('aria-label', 'Zoom profile picture');
        const actions = element('div', null, 'fp-photo-actions');
        const cancel = element('button', 'Cancel', 'fp-me-photo-button');
        const done = element('button', 'Done', 'fp-me-photo-button fp-photo-done');
        cancel.type = done.type = 'button';
        actions.append(cancel, done);
        picker.append(crop, instructions, zoom, actions);
        page.append(picker);
        let source = null, sourceUrl = '', scale = 1, offsetX = 0, offsetY = 0, active = new Map(), lastPinch = 0;
        const apply = () => {
            const width = crop.clientWidth || 300;
            const height = crop.clientHeight || width;
            if (!photo.naturalWidth) return;
            const fit = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
            const drawnW = photo.naturalWidth * fit * scale;
            const drawnH = photo.naturalHeight * fit * scale;
            offsetX = Math.max((width - drawnW)/2, Math.min((drawnW-width)/2, offsetX));
            offsetY = Math.max((height - drawnH)/2, Math.min((drawnH-height)/2, offsetY));
            photo.style.width = drawnW + 'px';
            photo.style.height = drawnH + 'px';
            photo.style.left = (width - drawnW)/2 + offsetX + 'px';
            photo.style.top = (height - drawnH)/2 + offsetY + 'px';
        };
        zoom.oninput = () => { scale = Number(zoom.value); apply(); };
        crop.addEventListener('pointerdown', event => { crop.setPointerCapture(event.pointerId); active.set(event.pointerId, {x:event.clientX,y:event.clientY}); lastPinch=0; });
        crop.addEventListener('pointermove', event => {
            if (!active.has(event.pointerId)) return;
            const old = active.get(event.pointerId);
            active.set(event.pointerId, {x:event.clientX,y:event.clientY});
            if (active.size === 1) { offsetX += event.clientX-old.x; offsetY += event.clientY-old.y; }
            else if (active.size === 2) {
                const [p,q] = [...active.values()];
                const distance = Math.hypot(p.x-q.x,p.y-q.y);
                if (lastPinch) scale = Math.max(1,Math.min(4,scale * distance / lastPinch));
                lastPinch=distance; zoom.value=String(scale);
            }
            apply();
        });
        const release = event => { active.delete(event.pointerId); lastPinch=0; };
        crop.addEventListener('pointerup',release);crop.addEventListener('pointercancel',release);
        const closePicker = () => { picker.hidden=true; controls.hidden=false; if(sourceUrl)URL.revokeObjectURL(sourceUrl);sourceUrl='';source=null;active.clear(); };
        cancel.onclick = closePicker;
        const upload = async () => {
            if (!source || done.disabled) return;
            const client = window.Famina?.client;
            if (!client?.auth || !client?.storage) { privateToast('Photo uploads are unavailable.',true);return; }
            done.disabled = true;
            done.classList.add('fp-button-busy');
            const label = done.textContent; done.textContent = '';
            const spinner = element('span',null,'fp-button-spinner');done.append(spinner);
            try {
                const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
                const context=canvas.getContext('2d');
                const side=crop.clientWidth;
                const ratio=512/side;
                context.drawImage(photo,(parseFloat(photo.style.left)||0)*ratio,(parseFloat(photo.style.top)||0)*ratio,parseFloat(photo.style.width)*ratio,parseFloat(photo.style.height)*ratio);
                const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.9));
                if(!blob)throw new Error('Could not prepare your photo.');
                const {data,error}=await client.auth.getSession();if(error)throw error;
                const id=data?.session?.user?.id;if(!id)throw new Error('Please sign in again.');
                const key=id+'/profile.jpg';
                const {error:uploadError}=await client.storage.from('avatars').upload(key,blob,{upsert:true,contentType:'image/jpeg'});
                if(uploadError)throw uploadError;
                const {data:publicData}=client.storage.from('avatars').getPublicUrl(key);
                const url=safePhoto(publicData?.publicUrl);
                if(!url)throw new Error('Could not retrieve photo URL.');
                const {error:updateError}=await client.auth.updateUser({data:{avatar_url:url}});
                if(updateError)throw updateError;
                avatarUrl=url+'?v='+Date.now();
                if(window.Famina?.user)window.Famina.user.avatar_url=avatarUrl;
                avatar.replaceChildren();
                const image=document.createElement('img');image.src=avatarUrl;image.alt='Profile photo';avatar.append(image);
                closePicker();
                privateToast('Profile photo updated.');
            } catch(error) { privateToast(error?.message||'Upload failed.',true); }
            finally { done.disabled=false;done.classList.remove('fp-button-busy');done.textContent=label; }
        };
        done.onclick=upload;
        [['Select from album',false],['Take a Photo',true]].forEach(([label,camera])=>{
            const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';
            if(camera)input.setAttribute('capture','user');
            input.hidden=true;
            input.onchange=()=>{
                const file=input.files?.[0];input.value='';
                if(!file)return;
                if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024) {
                    privateToast('Choose a JPG, PNG or WebP image under 2 MB.',true);return;
                }
                if(sourceUrl)URL.revokeObjectURL(sourceUrl);
                source=file;sourceUrl=URL.createObjectURL(file);
                photo.onload=()=>{scale=1;offsetX=0;offsetY=0;zoom.value='1';apply();};
                photo.src=sourceUrl;
                controls.hidden=true;picker.hidden=false;
            };
            const button=element('button',translateText(label),'fp-me-photo-button');button.type='button';
            button.onclick=()=>input.click();controls.append(input,button);
        });
        page.append(controls);
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
            renderMePage(page);
        } else if (screenId === 'profile-details') {
            renderProfileDetails(page);
        } else if (screenId === 'profile-photo') {
            renderProfilePhoto(page);
        } else if (screenId === 'profile-edit') {
            const key=profileEditField;const labels={nickname:'Nickname',gender:'Gender',date_of_birth:'Date of Birth',email:'Email'};
            const user=window.Famina?.user||{};renderProfileEditor(page,key,labels[key]||key,key==='email'?(user.email||''):(user.user_metadata?.[key]||''));
        } else if (screenId === 'profile-address') {
            renderAddressPage(page);
        } else if (screenId === 'account-limits') {
            renderAccountLimits(page);
        } else if(screenId==='settings'){renderMeSettings(page);
        } else if(screenId.startsWith('settings-')){renderSettingsDetail(page,byId[screenId]?.title||'Settings');
        } else if(screenId==='invitation'){profileBackHeader(page,'Invitation');const b=element('button',translateText('Share FAMIPAY'),'fp-me-signout');b.onclick=async()=>{const url=new URL('index.html',location.href).href;try{if(navigator.share)await navigator.share({title:'FAMIPAY',url});else {await navigator.clipboard.writeText(url);b.textContent=translateText('Link copied');}}catch(e){b.textContent=translateText('Unable to share. Try again.');}};page.append(b);
        } else if(screenId==='support-topic'){profileBackHeader(page,supportTopic||'Support');const card=element('section',null,'fp-me-menu');card.append(element('p',translateText('Contact support for assistance with this issue.')));meRow(card,'Help Center','help-center','help');page.append(card);
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
        } else if (role === 'customer' && (['my-cards','express-home','my-orders','my-profile','profile-details','profile-photo','profile-edit','profile-address','account-limits','settings','invitation','support-topic'].includes(screenId) || screenId.startsWith('settings-'))) {
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
