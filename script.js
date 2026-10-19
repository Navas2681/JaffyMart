const products = [
  {
    id: "C1P001",
    name: "JCB Backhoe Loader Toy",
    category: "Toys",
    price: 499,
    supplyPrice: 160.36,
    sku: "19392_lala_friction_powered_truck_toy_1pc",
    rating: 0,
    reviews: [],

    images: [
        "images/image jcb-toy-1.jpg",
        "images/image jcb-toy-2.jpg",
        "images/image jcb-toy-3.jpg",
        "images/image jcb-toy-5.jpg",
        "images/image jcb-toy-4.jpg"
    ],

    tag: "BESTSELLER",
    icon: "🚜",
    colors: ["#f0e9d8", "#b9a77c"],

    description: "Friction-powered construction toy for kids."
},

  {
    id: "portable-blender",
    name: "Portable Mini Blender",
    category: "Lifestyle",
    price: 699,
    tag: "DAILY USE",
    icon: "◒",
    colors: ["#f0d8cf", "#cf9d8d"]
  },
  {
    id: "car-phone-holder",
    name: "Car Phone Holder",
    category: "Accessories",
    price: 399,
    tag: "ON THE GO",
    icon: "▣",
    colors: ["#d7dfe0", "#8b9fa1"]
  },
  {
    id: "storage-pouches",
    name: "Travel Storage Pouches",
    category: "Lifestyle",
    price: 349,
    tag: "TRAVEL READY",
    icon: "▱",
    colors: ["#e8dfc7", "#bcae8b"]
  },
  {
    id: "cable-organizer",
    name: "Cable Organizer Set",
    category: "Accessories",
    price: 249,
    tag: "LESS CLUTTER",
    icon: "⌁",
    colors: ["#dfe5d6", "#a1b38e"]
  },
  {
    id: "drawer-organizer",
    name: "Drawer Organizer Tray",
    category: "Home",
    price: 449,
    tag: "HOME FIND",
    icon: "▦",
    colors: ["#e9e5d9", "#b9b5a5"]
  }
];

const productGrid = document.querySelector("#productGrid");
const cartCount = document.querySelector("#cartCount");
const cartToggle = document.querySelector("#cartToggle");
const cartClose = document.querySelector("#cartClose");
const cartBackdrop = document.querySelector("#cartBackdrop");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartSubtotal = document.querySelector("#cartSubtotal");
const checkoutButton = document.querySelector("#checkoutButton");

let cart = [];
let activeFilter = "All";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function productIllustration(product) {
  const [light, dark] = product.colors;

  return `
    <svg viewBox="0 0 180 180" aria-hidden="true">
      <ellipse cx="92" cy="151" rx="54" ry="9"
        fill="${dark}" opacity=".18"/>

      <rect x="38" y="38" width="104" height="102"
        rx="22" fill="${light}"/>

      <rect x="48" y="48" width="84" height="82"
        rx="17" fill="${dark}" opacity=".45"/>

      <rect x="58" y="57" width="64" height="64"
        rx="13" fill="${light}"/>

      <text x="90" y="101" font-size="34"
        text-anchor="middle" fill="${dark}"
        font-family="Arial, sans-serif">
        ${product.icon}
      </text>

      <path d="M54 62 Q90 45 126 62"
        fill="none" stroke="#fff"
        stroke-width="4" opacity=".65"/>
    </svg>
  `;
}

function renderProducts() {
  const visibleProducts = products.filter(product =>
    activeFilter === "All" ||
    product.category === activeFilter
  );

  productGrid.innerHTML = visibleProducts.map(product => {
    const firstImage = product.images?.[0];
    const light = product.colors?.[0] || "#edf0e6";

    const imageContent = firstImage
      ? `<img class="card-product-photo"
               src="${firstImage}"
               alt="${product.name}"
               loading="lazy">`
      : `<div class="visual">
           ${productIllustration({
             ...product,
             colors: product.colors || ["#f0e9d8", "#b9a77c"],
             icon: product.icon || "🛍️"
           })}
         </div>`;

    return `
      <article class="product-card" data-product="${product.id}">
        <div class="product-image" style="background:${light}">
          <span class="product-tag">${product.tag || ""}</span>
          ${imageContent}
          <button class="product-quick" data-add="${product.id}">
            Add to cart +
          </button>
        </div>

        <div class="product-meta">
          <div>
            <h3 class="product-name">${product.name}</h3>
            <span class="product-category">${product.category}</span>
            <div class="card-rating">
              ${product.rating > 0
                ? `★ ${product.rating} (${product.reviews?.length || 0} reviews)`
                : "No reviews yet"}
            </div>
          </div>
          <span class="product-price">${money(product.price)}</span>
        </div>
      </article>
    `;
  }).join("");
}

const productDetails = document.querySelector("#productDetails");
const detailsBackdrop = document.querySelector("#detailsBackdrop");
const detailsImageTrack = document.querySelector("#detailsImageTrack");
const detailsCounter = document.querySelector("#detailsCounter");
const detailsThumbnails = document.querySelector("#detailsThumbnails");

let currentDetailProduct = null;

function openProductDetails(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  currentDetailProduct = product;
  const images = product.images || [];

  document.querySelector("#detailCategory").textContent = product.category;
  document.querySelector("#detailName").textContent = product.name;
  document.querySelector("#detailPrice").textContent = money(product.price);
  document.querySelector("#detailDescription").textContent =
    product.description || "Product details will be added soon.";

  const reviews = product.reviews || [];
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  document.querySelector("#detailRating").textContent = reviews.length
    ? `★ ${average.toFixed(1)} out of 5 · ${reviews.length} reviews`
    : "No reviews yet";

  detailsImageTrack.innerHTML = images.length
    ? images.map((image, index) => `
        <img src="${image}" alt="${product.name} photo ${index + 1}">
      `).join("")
    : `<div class="detail-description">Product photos coming soon.</div>`;

  detailsThumbnails.innerHTML = images.map((image, index) => `
    <button type="button" data-image-index="${index}"
            class="${index === 0 ? "active" : ""}"
            aria-label="View photo ${index + 1}">
      <img src="${image}" alt="">
    </button>
  `).join("");

  detailsCounter.textContent = images.length ? `1 / ${images.length}` : "0 / 0";

  document.querySelector("#detailReviews").innerHTML = reviews.length
    ? reviews.map(review => `
        <div class="review-item">
          <strong>${"★".repeat(Math.max(0, Math.min(5, review.rating)))}</strong>
          <p>${review.text}</p>
        </div>
      `).join("")
    : `<p class="detail-description">No customer reviews yet.</p>`;

  productDetails.hidden = false;
  detailsBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProductDetails() {
  productDetails.hidden = true;
  detailsBackdrop.hidden = true;
  document.body.style.overflow = "";
}

document.querySelector("#detailsClose").addEventListener("click", closeProductDetails);
detailsBackdrop.addEventListener("click", closeProductDetails);

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    event.stopPropagation();
    addToCart(addButton.dataset.add);
    return;
  }

  const card = event.target.closest("[data-product]");
  if (card) openProductDetails(card.dataset.product);
});

detailsThumbnails.addEventListener("click", event => {
  const button = event.target.closest("[data-image-index]");
  if (!button) return;

  const index = Number(button.dataset.imageIndex);
  detailsImageTrack.scrollTo({
    left: index * detailsImageTrack.clientWidth,
    behavior: "smooth"
  });

  detailsThumbnails.querySelectorAll("button").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
});

document.querySelector("#detailAddToCart").addEventListener("click", () => {
  if (currentDetailProduct) {
    addToCart(currentDetailProduct.id);
    closeProductDetails();
  }
});

detailsImageTrack.addEventListener("scroll", () => {
  const images = detailsImageTrack.querySelectorAll("img");
  if (!images.length || !detailsImageTrack.clientWidth) return;

  const index = Math.round(
    detailsImageTrack.scrollLeft / detailsImageTrack.clientWidth
  );

  detailsCounter.textContent = `${index + 1} / ${images.length}`;

  detailsThumbnails.querySelectorAll("button").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
});

function openCart() {
  document.body.classList.add("cart-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function addToCart(productId) {
  const existingProduct = cart.find(
    item => item.id === productId
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(
      p => p.id === item.id
    );

    return sum +
      (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalItems;
  cartSubtotal.textContent = money(subtotal);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is waiting for a good find.
        <br>
        Explore the collection and add something you like.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(
      p => p.id === item.id
    );

    return `
      <div class="cart-item">
        <div class="cart-thumb"
          style="background:${product.colors[0]}">
          ${product.icon}
        </div>

        <div>
          <h3>${product.name}</h3>
          <p>
            ${money(product.price)} · Qty ${item.quantity}
          </p>

          <button class="remove-item"
            data-remove="${product.id}">
            Remove
          </button>
        </div>

        <strong>
          ${money(product.price * item.quantity)}
        </strong>
      </div>
    `;
  }).join("");
}

// Product category filters
document.querySelectorAll(".filter-chip")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip")
        .forEach(chip =>
          chip.classList.remove("active")
        );

      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderProducts();
    });
  });

// Add products to cart
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(button.dataset.add);
  }
});

// Update image counter when customers swipe
productGrid.addEventListener("scroll", event => {
  const track = event.target;

  if (!track.classList.contains("gallery-track")) {
    return;
  }

  const gallery = track.closest(".product-gallery");
  const counter = gallery?.querySelector(".gallery-counter");

  if (!counter || track.clientWidth === 0) {
    return;
  }

  const currentIndex = Math.round(
    track.scrollLeft / track.clientWidth
  );

  const totalImages = track.querySelectorAll("img").length;

  counter.textContent = `${currentIndex + 1} / ${totalImages}`;
}, true);

// Remove products from cart
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");

  if (button) {
    removeFromCart(button.dataset.remove);
  }
});

// Cart controls
cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

// Checkout preview only — no real order is submitted
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a product first.");
    return;
  }

  alert(
    "This is a demo storefront. " +
    "Checkout, secure order storage, payment verification " +
    "and Dropplier fulfilment will be added next. " +
    "No order or payment has been created."
  );
});

// Footer year
document.querySelector("#year").textContent =
  new Date().getFullYear();

// Initial page rendering
renderProducts();
renderCart();