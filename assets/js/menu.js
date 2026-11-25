(function () {
  const F = window.Famina;
  window.renderRestaurants = async function () {
    const container =
      document.getElementById("restaurants-list") ||
      document.getElementById("restaurants-grid");
    if (!container) return;
    try {
      const rows = await F.api("/restaurants");
      container.innerHTML = rows.length
        ? rows
            .map(
              (r) =>
                `<div class="restaurant-card"><img src="${F.safeImage(r.image)}" alt="${F.escape(r.name)}"><div class="restaurant-info"><h3 data-no-translate>${F.escape(r.name)}</h3><p data-no-translate>${F.escape(r.cuisine)}</p><p data-no-translate>${F.escape(r.description)}</p><p>${F.t(r.available ? "Available" : "Unavailable")}</p><a class="btn" href="menu.html?restaurant=${encodeURIComponent(r.id)}">${F.t("View Menu")}</a></div></div>`,
            )
            .join("")
        : `<p>${F.t("No approved restaurants yet.")}</p>`;
    } catch (e) {
      container.textContent = F.t(
        "Restaurant directory is temporarily unavailable.",
      );
    }
  };
  let menu = [], loadingMenu = false;
  function menuState(title, description, retry = false) {
    const container = document.getElementById('menu-items');
    if (!container) return;
    container.innerHTML = `<div class="menu-state"><span class="menu-state-symbol" aria-hidden="true">${retry?'↻':'⌑'}</span><h2>${F.escape(F.t(title))}</h2><p>${F.escape(F.t(description))}</p><div class="menu-state-actions">${retry?`<button type="button" data-menu-retry>${F.escape(F.t('Try again'))}</button> `:''}<a class="${retry?'menu-state-secondary':''}" href="restaurant.html">${F.escape(F.t('Browse restaurants'))}</a></div></div>`;
  }
  function render(items) {
    const container = document.getElementById("menu-items");
    if (!container) return;
    document.getElementById('results-count').textContent = `${items.length} ${F.t('items found')}`;
    if (!items.length) {
      menuState('No dishes available yet', 'Choose another restaurant or check back as menus are added.');
      return;
    }
    container.innerHTML = items.length
      ? items
          .map(
            (m) =>
              `<div class="menu-item"><img src="${F.safeImage(m.image)}" alt="${F.escape(m.name)}"><div class="menu-item-info"><h3 data-no-translate>${F.escape(m.name)}</h3><p data-no-translate>${F.escape(m.description)}</p><p class="price" data-no-translate>${F.money(m.price)}</p><button class="add-to-cart" data-add-item="${m.id}" ${!m.available || !m.restaurants?.available ? "disabled" : ""}>${F.t(m.available && m.restaurants?.available ? "Add to Cart" : "Unavailable")}</button></div></div>`,
          )
          .join("")
      : `<p>${F.t("No verified menu items available.")}</p>`;
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-item]");
    if (button) F.busy(button, () => window.addToCart(button.dataset.addItem));
    if (event.target.closest('[data-menu-retry]')) loadMenu();
  });
  async function loadMenu() {
    if (!document.getElementById("menu-items")) return;
    if (loadingMenu) return;
    loadingMenu = true;
    document.getElementById('results-count').textContent = F.t('Loading menu...');
    document.getElementById('menu-items').setAttribute('aria-busy','true');
    document.getElementById('menu-items').replaceChildren();
    const pills = document.getElementById('menu-categories');
    if (pills) pills.replaceChildren();
    try {
      menu = await F.api("/menu", { signal: AbortSignal.timeout(8000) });
      if (!Array.isArray(menu)) throw Error('Invalid menu data');
      const params = new URLSearchParams(location.search);
      if (params.has("restaurant"))
        menu = menu.filter((m) => m.restaurant_id === params.get("restaurant"));
      const category = categories.find(
        (c) => String(c.id) === params.get("category"),
      );
      if (category)
        menu = menu.filter(
          (m) => m.category.toLowerCase() === category.name.toLowerCase(),
        );
      render(menu);
      if (pills && menu.length) {
        pills.innerHTML = ["All", ...new Set(menu.map((m) => m.category))]
          .map(
            (name) =>
              `<button class="menu-pill" data-category="${F.escape(name)}" aria-pressed="${name==='All'}">${F.escape(name === "All" ? F.t(name) : name)}</button>`,
          )
          .join("");
        pills.onclick = (e) => {
          const b = e.target.closest("[data-category]");
          if (b) {
            pills.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
            render(
              b.dataset.category === "All"
                ? menu
                : menu.filter((m) => m.category === b.dataset.category),
            );
          }
        };
      }
    } catch (e) {
      document.getElementById('results-count').textContent = F.t('Menu unavailable');
      menuState("We couldn't load the menu", 'Please try again or browse local restaurants.', true);
    } finally {
      loadingMenu = false;
      document.getElementById('menu-items').removeAttribute('aria-busy');
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    renderRestaurants();
    loadMenu();
  });
})();
