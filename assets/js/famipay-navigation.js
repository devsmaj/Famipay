(() => {
    const app = window.Capacitor?.Plugins?.App || window.Capacitor?.App;
    if (!app?.addListener) return;

    Promise.resolve(app.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack || (location.hash && history.length > 1)) {
            history.back();
        } else {
            app.exitApp?.();
        }
    })).catch(error => console.error('Could not register the FAMIPAY back-button handler:', error));
})();
