(function () {
  const F = window.Famina;
  if (F.cartControllerInitialized) return;
  F.cartControllerInitialized = true;
  let renderRevision = 0;
  async function getCart() {
    return F.Cart.get();
  }
  async function updateCartCount() {
    await F.Cart.refreshBadge();
  }
  async function renderCartItems() {
    const el = document.getElementById("cart-items");
    if (!el) return;
    const revision = ++renderRevision;
    try {
      const items = await getCart();
      if (revision !== renderRevision) return;
      const summary = document.getElementById('cart-summary');
      const checkout = document.getElementById('cart-checkout');
      if (summary) summary.hidden = !items.length;
      if (checkout) checkout.hidden = !items.length || items.some(i=>!i.available);
      el.classList.toggle('is-empty', !items.length);
      let notice = document.getElementById("guest-cart-import");
      if (F.user?.role === "customer" && F.Cart.hasGuestItems()) {
        if (!notice) {
          notice = document.createElement("div");
          notice.id = "guest-cart-import";
          notice.className = "platform-note";
          el.before(notice);
        }
        notice.innerHTML = `<p>${F.t("Your guest cart is saved. Resolve unavailable or conflicting items, then retry the import.")}</p><button type="button" class="btn-secondary" data-retry-cart>${F.t("Retry saved cart")}</button>`;
      } else notice?.remove();
      el.innerHTML = items.length
        ? items
            .map(
              (i) =>
                `<div class="cart-item">${i.image ? `<img src="${F.safeImage(i.image)}" alt="${F.escape(i.name)}">` : ""}<div class="cart-item-info"><h3 data-no-translate>${F.escape(i.name)}</h3><p>${i.price === null ? F.t("Unavailable") : F.money(i.price)}</p><div class="quantity-controls"><button data-item="${i.id}" data-quantity="${i.quantity - 1}" aria-label="${F.t("Decrease quantity")}" ${!i.available ? "disabled" : ""}>-</button><span>${i.quantity}</span><button data-item="${i.id}" data-quantity="${i.quantity + 1}" aria-label="${F.t("Increase quantity")}" ${i.quantity >= 50 || !i.available ? "disabled" : ""}>+</button></div><button class="remove-item" data-item="${i.id}" data-quantity="0">${F.t("Remove")}</button></div></div>`,
            )
            .join("")
        : `<div class="cart-empty"><span class="cart-empty-icon" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 22h32l4 33H12l4-33Z" stroke-linejoin="round"/><path d="M24 25v-9a8 8 0 0 1 16 0v9" stroke-linecap="round"/><path d="M25 37c3 6 11 6 14 0" stroke-linecap="round"/></svg></span><h2>${F.t('Your next meal starts here')}</h2><p>${F.t('Your cart is empty. Explore local restaurants and add something you love.')}</p><a class="cart-explore-button" href="restaurant.html">${F.t('Browse restaurants')} <span aria-hidden="true">↗</span></a><a class="cart-location-link" href="index.html#delivery-finder-title">${F.t('Choose your delivery point')}</a></div>`;
      const total = document.getElementById("cart-total");
      if (total) {
        total.hidden = !items.length;
        total.textContent = items.some((i) => !i.available)
          ? F.t("Remove unavailable items before checkout.")
          : F.t("Subtotal") +
            ": " +
            F.money(items.reduce((s, i) => s + i.price * i.quantity, 0));
      }
    } catch (e) {
      if (revision !== renderRevision) return;
      const summary = document.getElementById('cart-summary');
      const checkout = document.getElementById('cart-checkout');
      if (summary) summary.hidden = true;
      if (checkout) checkout.hidden = true;
      el.classList.add('is-empty');
      el.innerHTML = `<div class="cart-empty"><h2>${F.t('Your cart could not load')}</h2><p>${F.t('Please try again. Your saved items have not been changed.')}</p><button class="cart-explore-button" type="button" data-reload-cart>${F.t('Try again')}</button><a class="cart-location-link" href="restaurant.html">${F.t('Browse restaurants')}</a></div>`;
    }
  }
  window.addToCart = async (itemId, quantity = 1) => {
    await F.Cart.add(itemId, quantity);
    await updateCartCount();
    F.notify("Item added to cart.");
  };
  window.getCart = getCart;
  window.updateCartCount = updateCartCount;
  window.renderCartItems = renderCartItems;
  window.calculateCartTotal = async () =>
    (await getCart()).reduce((s, i) => s + i.price * i.quantity, 0);
  document.addEventListener("click", (e) => {
    if (e.target.closest('[data-reload-cart]')) { renderCartItems(); return; }
    const retry = e.target.closest("[data-retry-cart]");
    if (retry) {
      F.busy(retry, () => F.Cart.merge().then(renderCartItems));
      return;
    }
    const b = e.target.closest("[data-quantity]");
    if (!b) return;
    F.busy(b, async () => {
      const quantity = Number(b.dataset.quantity);
      await F.Cart.set(b.dataset.item, quantity);
      await renderCartItems();
      await updateCartCount();
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    renderCartItems();
  });
  window.addEventListener("famina-cart-change", renderCartItems);
  window.addEventListener("famina-auth-updated", renderCartItems);
})();
