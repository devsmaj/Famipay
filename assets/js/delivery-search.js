(() => {
  const form = document.getElementById('delivery-search-form');
  if (!form) return;
  const input = document.getElementById('delivery-search');
  const error = document.getElementById('delivery-search-error');
  const panel = document.getElementById('delivery-map-panel');
  const status = document.getElementById('delivery-map-status');
  const locate = document.getElementById('delivery-use-location');
  const confirm = document.getElementById('delivery-confirm');
  const translate = text => window.i18n?.translateText(text) || text;
  let map, marker, point;
  function message(text) { status.textContent = translate(text); }
  function clearError() { error.hidden = true; input.removeAttribute('aria-invalid'); }
  function showMap() {
    panel.hidden = false;
    if (!window.L) { message('Map unavailable. Please reload and try again.'); return false; }
    if (!map) {
      map = L.map('delivery-picker-map').setView([13.829, 20.832], 14);
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      tiles.on('tileerror', () => message('Map tiles could not load. Check your connection and try again.'));
      map.on('click', event => selectPoint(event.latlng.lat, event.latlng.lng));
    }
    requestAnimationFrame(() => map.invalidateSize());
    return true;
  }
  function selectPoint(latitude, longitude) {
    point = { latitude, longitude };
    if (!marker) {
      marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        selectPoint(position.lat, position.lng);
      });
    } else marker.setLatLng([latitude, longitude]);
    confirm.disabled = false;
    message('Delivery point selected. Drag the pin to adjust it.');
  }
  input.addEventListener('input', clearError);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!input.value.trim()) {
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    clearError();
    if (showMap()) message(point ? 'Delivery point selected. Drag the pin to adjust it.' : 'Tap the map to choose your exact delivery point.');
  });
  locate.addEventListener('click', () => {
    clearError();
    if (!showMap()) return;
    if (!navigator.geolocation) { message('Location is unavailable. Type your address and select a point on the map.'); return; }
    locate.disabled = true;
    locate.setAttribute('aria-busy', 'true');
    message('Finding your current location...');
    const finish = () => { locate.disabled = false; locate.removeAttribute('aria-busy'); };
    navigator.geolocation.getCurrentPosition(position => {
      finish();
      selectPoint(position.coords.latitude, position.coords.longitude);
      map.setView([point.latitude, point.longitude], 17);
      if (!input.value.trim()) input.value = `${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
    }, () => {
      finish();
      message('Location permission denied or unavailable. Type your address and tap the map instead.');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
  });
  confirm.addEventListener('click', () => {
    if (!point || !input.value.trim()) { form.requestSubmit(); return; }
    try {
      sessionStorage.setItem('famina-delivery-draft', JSON.stringify({ address: input.value.trim(), ...point }));
    } catch (_) {
      message('Your browser could not save the delivery point. Please enable storage and try again.');
      return;
    }
    location.assign('restaurant.html');
  });
})();
