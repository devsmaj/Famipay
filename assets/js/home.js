document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("categories-grid");
  if (grid)
    grid.innerHTML = categories
      .map(
        (c) =>
          `<a class="category-card" href="menu.html?category=${c.id}"><span class="category-image-wrap"><img src="${c.image}" alt="" width="240" height="240" loading="lazy" decoding="async"></span><h3>${c.name}</h3></a>`,
      )
      .join("");
});
