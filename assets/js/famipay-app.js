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
        location.hash = id;
    }

    function addSideNavigation() {
        side.append(element('div', 'FAMIPAY', 'brand'), element('small', 'PRIVATE FRONTEND · DESIGN PROTOTYPE'));
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

    function render() {
        main.replaceChildren(buildHeader());
        const id = decodeURIComponent(location.hash.slice(1) || 'home');
        const screenId = byId[id] || id === 'home' ? id : 'home';
        if (screenId === 'home') {
            main.append(element('div', 'Available balance · DEMO ONLY', 'fp-balance-label'));
            const hero = element('div', null, 'hero');
            hero.append(element('h2', '125,000 FCFA'), element('p', 'No real wallet or financial provider is connected.'));
            main.append(hero);
            for (const group of groups.filter(item => !['Getting started', 'Account'].includes(item))) {
                main.append(element('h2', group, 'fp-section-title'));
                const grid = cards(visible.filter(item => item.group === group));
                grid.classList.add('fp-service-grid');
                main.append(grid);
            }
            main.append(element('div', 'Financial actions and commerce orders are not connected to live services.', 'warning'));
        } else {
            const screen = byId[screenId];
            main.append(element('small', screen.group.toUpperCase()), element('h1', screen.title));
            const back = element('button', '← Dashboard', 'btn alt');
            back.onclick = () => navigate('home');
            main.append(back);
            const process = element('section', null, 'panel');
            process.append(element('h2', 'Step-by-step process'));
            const steps = element('div', null, 'steps');
            ['Open ' + screen.title, 'Enter or choose details', 'Validate input', 'Review full amount and fees', 'Authorize via approved backend', 'Show verified status or error']
                .forEach((text, index) => steps.append(element('span', `${index + 1}. ${text}`)));
            process.append(steps);
            main.append(process);
            const form = element('form', null, 'panel');
            form.append(element('h2', screen.title + ' details'));
            (fields[screen.title] || fields.default).forEach((name, index) => {
                const label = element('label', name, 'field');
                const input = document.createElement('input');
                input.required = true;
                input.name = 'f' + index;
                input.placeholder = name;
                label.append(input);
                form.append(label);
            });
            const submit = element('button', 'Review (demo)', 'btn');
            submit.type = 'submit';
            form.append(submit);
            const result = element('p', null, 'warning');
            result.hidden = true;
            result.setAttribute('role', 'status');
            form.append(result);
            form.addEventListener('submit', event => {
                event.preventDefault();
                if (!form.reportValidity()) return;
                result.textContent = 'DEMO REVIEW ONLY. No payment, order, account change or database request has been submitted.';
                result.hidden = false;
            });
            main.append(form);
            const related = element('section', null, 'panel');
            related.append(element('h2', 'Related pages'), cards(visible.filter(item => item.group === screen.group && item.id !== screenId).slice(0, 8)));
            main.append(related, element('div', 'Prototype only: no backend writes, authorization or financial processing are implemented here.', 'warning'));
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
