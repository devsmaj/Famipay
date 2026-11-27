(() => {
    const app = window.Capacitor?.Plugins?.App || window.Capacitor?.App;
    if (!app?.addListener) return;

    Promise.resolve(app.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname.endsWith('famipay-app.html')) {
            const route = decodeURIComponent(location.hash.slice(1) || 'home');
            const primary = ['home', 'wallet', 'express-home', 'my-orders', 'my-profile',
                'merchant-dashboard', 'catalog-management', 'merchant-orders',
                'agent-float', 'find-agent', 'agent-dashboard',
                'rider-dashboard', 'delivery-details', 'delivery-proof',
                'payment-exceptions', 'service-configuration', 'admin-dashboard'];
            if (route !== 'home' && !primary.includes(route)) {
                location.hash = 'home';
                return;
            }
            if (canGoBack && route !== 'home') {
                history.back();
                return;
            }
        }
        app.exitApp?.();
    })).catch(error => console.error('Could not register the FAMIPAY back-button handler:', error));
})();
