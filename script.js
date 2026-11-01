const PHONE = "212723535414";
const INSTAGRAM =
    "https://www.instagram.com/hanarosia.parfum/";

// Éléments du site
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const cartCount = document.getElementById("cartCount");

const products = [...document.querySelectorAll(".product-card")];
const filters = document.querySelectorAll(".filter");
const navCategoryLinks =
    document.querySelectorAll("[data-category]");

let activeCategory = "all";
let orderClicks = 0;

// Année actuelle dans le footer
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Lien WhatsApp dans le footer
const whatsappFooter = document.getElementById("whatsappFooter");

whatsappFooter.href =
    `https://wa.me/${PHONE}?text=` +
    encodeURIComponent("Bonjour Hanarosia, je souhaite des informations.");

// Ouvrir / fermer le menu mobile
menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Filtrer et rechercher les produits
function updateProducts() {
    const query = searchInput.value
        .trim()
        .toLocaleLowerCase("fr");

    products.forEach(product => {
        const name = product.dataset.name;
        const category = product.dataset.category;

        const matchesSearch = name.includes(query);
        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        product.hidden = !(matchesSearch && matchesCategory);
    });

    // Trier les produits visibles par prix
    const visibleProducts = products.filter(
        product => !product.hidden
    );

    const sortMode = sortSelect.value;

    if (sortMode === "low") {
        visibleProducts.sort(
            (a, b) => Number(a.dataset.price) -
            Number(b.dataset.price)
        );
    } else if (sortMode === "high") {
        visibleProducts.sort(
            (a, b) => Number(b.dataset.price) -
            Number(a.dataset.price)
        );
    }

    visibleProducts.forEach(product => {
        productGrid.appendChild(product);
    });

    noResults.hidden = visibleProducts.length !== 0;
}

// Barre de recherche
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    updateProducts();

    document.getElementById("parfums").scrollIntoView({
        behavior: "smooth"
    });
});

searchInput.addEventListener("input", updateProducts);

// Filtres de catégories
filters.forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        filters.forEach(filter => {
            filter.classList.toggle(
                "active",
                filter === button
            );
        });

        updateProducts();
    });
});

// Catégories dans la navigation
navCategoryLinks.forEach(link => {
    link.addEventListener("click", () => {
        const category = link.dataset.category;

        if (category) {
            activeCategory = category;

            filters.forEach(filter => {
                filter.classList.toggle(
                    "active",
                    filter.dataset.category === category
                );
            });

            updateProducts();
        }
    });
});

// Trier les produits
sortSelect.addEventListener("change", updateProducts);

// Commander via WhatsApp
document.querySelectorAll(".order-button").forEach(button => {
    button.addEventListener("click", () => {
        const productName = button.dataset.product;

        const message =
            `Bonjour Hanarosia, je souhaite commander ` +
            `${productName}. Pouvez-vous me donner plus d'informations ?`;

        const url =
            `https://wa.me/${PHONE}?text=` +
            encodeURIComponent(message);

        orderClicks++;
        cartCount.textContent = orderClicks;

        window.open(url, "_blank", "noopener,noreferrer");
    });
});

// État initial
updateProducts();