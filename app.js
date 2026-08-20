let products = [];
let cart = JSON.parse(localStorage.getItem("chinaCart")) || [];
let favorites = JSON.parse(localStorage.getItem("chinaFavorites")) || [];

let currentCategory = "all";

const productsBox = document.getElementById("products");
const productCount = document.getElementById("productCount");
const empty = document.getElementById("empty");

function formatPrice(price) {
  return "$ " + Number(price || 0).toLocaleString("en-US");
}

function categoryName(category) {
  const names = {
    erkaklar: "👕 Erkaklar",
    "oyoq-kiyim": "👟 Oyoq kiyim",
    "koz-oynak": "🕶 Ko‘zoynak",
    "bosh-kiyim": "🧢 Bosh kiyim",
  };

  return names[category] || category || "";
}

function saveCart() {
  localStorage.setItem("chinaCart", JSON.stringify(cart));
}

function saveFavorites() {
  localStorage.setItem("chinaFavorites", JSON.stringify(favorites));
}

function updateCartCount() {
  const el = document.getElementById("cartCount");

  if (!el) return;

  let count = 0;

  cart.forEach((item) => {
    count += Number(item.quantity) || 1;
  });

  el.textContent = count;
}

function updateFavoriteCount() {
  const el = document.getElementById("favoriteCount");

  if (el) {
    el.textContent = favorites.length;
  }
}

/* =========================
   MAHSULOTLAR
========================= */

function renderProducts(list) {
  if (!productsBox) return;

  productsBox.innerHTML = "";

  if (productCount) {
    productCount.textContent = list.length + " ta mahsulot";
  }

  if (list.length === 0) {
    if (empty) empty.classList.remove("hidden");
    return;
  }

  if (empty) empty.classList.add("hidden");

  list.forEach((product) => {
    const card = document.createElement("article");

    card.className = "product-card";

    const id = Number(product.id);
    const isFavorite = favorites.includes(id);

    card.innerHTML = `
      <div class="product-image-wrap">

        <img
          src="${product.image || ""}"
          alt="${product.name || "Mahsulot"}"
          class="product-img"
        >

        <button
          class="heart"
          data-id="${id}"
          type="button"
        >
          ${isFavorite ? "❤️" : "♡"}
        </button>

      </div>

      <div class="product-info">

        <div>⭐⭐⭐⭐⭐</div>

        <h3>${product.name || "Mahsulot"}</h3>

        <p>${categoryName(product.category)}</p>

        ${product.description ? `<p>${product.description}</p>` : ""}

        <div class="price">
          ${formatPrice(product.price)}
        </div>

        <button
          class="add-cart"
          data-id="${id}"
          type="button"
        >
          🛒 Savatga qo‘shish
        </button>

      </div>
    `;

    productsBox.appendChild(card);
  });

  /* SAVATGA */

  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      const product = products.find((item) => Number(item.id) === id);

      if (!product) return;

      const oldProduct = cart.find((item) => Number(item.id) === id);

      if (oldProduct) {
        oldProduct.quantity = (Number(oldProduct.quantity) || 1) + 1;
      } else {
        cart.push({
          ...product,
          quantity: 1,
        });
      }

      saveCart();
      updateCartCount();

      alert("🛒 Mahsulot savatga qo‘shildi!");
    });
  });

  /* SEVIMLILAR */

  document.querySelectorAll(".heart").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      if (favorites.includes(id)) {
        favorites = favorites.filter((itemId) => itemId !== id);

        this.textContent = "♡";
      } else {
        favorites.push(id);

        this.textContent = "❤️";
      }

      saveFavorites();
      updateFavoriteCount();
    });
  });
}

/* =========================
   QIDIRUV VA FILTR
========================= */

function filterProducts() {
  const searchInput = document.getElementById("searchInput");

  const minInput = document.getElementById("minPrice");

  const maxInput = document.getElementById("maxPrice");

  const sortSelect = document.getElementById("sortSelect");

  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const min = minInput ? Number(minInput.value) || 0 : 0;

  const maxText = maxInput ? maxInput.value : "";

  const max = maxText === "" ? Infinity : Number(maxText);

  let result = products.filter((product) => {
    const name = String(product.name || "").toLowerCase();

    const description = String(product.description || "").toLowerCase();

    const price = Number(product.price) || 0;

    const searchOK = name.includes(search) || description.includes(search);

    const categoryOK =
      currentCategory === "all" || product.category === currentCategory;

    return searchOK && categoryOK && price >= min && price <= max;
  });

  const sort = sortSelect ? sortSelect.value : "default";

  if (sort === "cheap") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "expensive") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "name") {
    result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  renderProducts(result);
}

/* =========================
   SAVAT OYNASI
========================= */

function createCartModal() {
  if (document.getElementById("cartModal")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "cartModal";

  modal.innerHTML = `
    <div class="cart-overlay">

      <div class="cart-window">

        <button
          id="closeCart"
          class="close-cart"
          type="button"
        >
          ✕
        </button>

        <h2>🛒 Mening savatim</h2>

        <div id="cartItems"></div>

        <div
          id="cartEmpty"
          class="cart-empty"
        >
          🛒 Savat hozircha bo‘sh
        </div>

        <div class="cart-bottom">

          <div class="cart-total-row">

            <span>Jami summa:</span>

            <strong id="cartTotal">
              $ 0
            </strong>

          </div>

          <a
            class="telegram-order"
            href="https://t.me/abdulazizsobitov"
            target="_blank"
            rel="noopener"
          >
            ✈️ Buyurtma berish
          </a>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeCart").addEventListener("click", closeCart);

  modal
    .querySelector(".cart-overlay")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        closeCart();
      }
    });
}

function openCart() {
  createCartModal();

  const modal = document.getElementById("cartModal");

  modal.classList.add("show");

  renderCart();
}

function closeCart() {
  const modal = document.getElementById("cartModal");

  if (modal) {
    modal.classList.remove("show");
  }
}

/* =========================
   SAVATNI CHIQARISH
========================= */

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  const cartEmpty = document.getElementById("cartEmpty");

  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartEmpty || !cartTotal) {
    return;
  }

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartTotal.textContent = "$ 0";
    return;
  }

  cartEmpty.style.display = "none";

  let total = 0;

  cart.forEach((item) => {
    const quantity = Number(item.quantity) || 1;

    const price = Number(item.price) || 0;

    const itemTotal = price * quantity;

    total += itemTotal;

    const row = document.createElement("div");

    row.className = "cart-item";

    row.innerHTML = `
      <img
        src="${item.image || ""}"
        alt="${item.name || "Mahsulot"}"
      >

      <div class="cart-info">

        <h3>${item.name || "Mahsulot"}</h3>

        <p>${formatPrice(price)}</p>

        <div class="quantity">

          <button
            class="minus"
            data-id="${item.id}"
            type="button"
          >
            −
          </button>

          <strong>
            ${quantity}
          </strong>

          <button
            class="plus"
            data-id="${item.id}"
            type="button"
          >
            +
          </button>

        </div>

      </div>

      <div class="cart-right">

        <strong>
          ${formatPrice(itemTotal)}
        </strong>

        <button
          class="remove"
          data-id="${item.id}"
          type="button"
        >
          🗑
        </button>

      </div>
    `;

    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll(".minus").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      const item = cart.find((product) => Number(product.id) === id);

      if (!item) return;

      item.quantity = (Number(item.quantity) || 1) - 1;

      if (item.quantity <= 0) {
        cart = cart.filter((product) => Number(product.id) !== id);
      }

      saveCart();
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll(".plus").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      const item = cart.find((product) => Number(product.id) === id);

      if (!item) return;

      item.quantity = (Number(item.quantity) || 1) + 1;

      saveCart();
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      cart = cart.filter((product) => Number(product.id) !== id);

      saveCart();
      updateCartCount();
      renderCart();
    });
  });
}

/* =========================
   TUGMALAR
========================= */

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}

const headerButtons = document.querySelectorAll(".header-buttons button");

if (headerButtons.length >= 3) {
  headerButtons[2].addEventListener("click", openCart);
}

/* =========================
   SEARCH
========================= */

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

const clearSearch = document.getElementById("clearSearch");

if (clearSearch) {
  clearSearch.addEventListener("click", function () {
    if (searchInput) {
      searchInput.value = "";
    }

    filterProducts();
  });
}

/* =========================
   KATEGORIYA
========================= */

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", function () {
    document
      .querySelectorAll(".category")
      .forEach((btn) => btn.classList.remove("active"));

    this.classList.add("active");

    currentCategory = this.dataset.category;

    filterProducts();
  });
});

/* =========================
   SARALASH
========================= */

const sortSelect = document.getElementById("sortSelect");

if (sortSelect) {
  sortSelect.addEventListener("change", filterProducts);
}

/* =========================
   FILTR
========================= */

const filterBtn = document.getElementById("filterBtn");

if (filterBtn) {
  filterBtn.addEventListener("click", function () {
    const panel = document.getElementById("filterPanel");

    if (panel) {
      panel.classList.toggle("hidden");
    }
  });
}

const applyFilter = document.getElementById("applyFilter");

if (applyFilter) {
  applyFilter.addEventListener("click", filterProducts);
}

const resetFilter = document.getElementById("resetFilter");

if (resetFilter) {
  resetFilter.addEventListener("click", function () {
    document.getElementById("minPrice").value = "";

    document.getElementById("maxPrice").value = "";

    filterProducts();
  });
}

/* =========================
   DARK MODE
========================= */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    localStorage.setItem(
      "chinaDarkMode",
      document.body.classList.contains("dark") ? "1" : "0",
    );
  });
}

if (localStorage.getItem("chinaDarkMode") === "1") {
  document.body.classList.add("dark");
}

/* =========================
   SUPABASEDAN YUKLASH
========================= */

async function loadProducts() {
  if (productsBox) {
    productsBox.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
      ">
        ⏳ Mahsulotlar yuklanmoqda...
      </div>
    `;
  }

  products = await getProducts();

  filterProducts();

  updateCartCount();
  updateFavoriteCount();
}

/* =========================
   BOSHLASH
========================= */

loadProducts();
