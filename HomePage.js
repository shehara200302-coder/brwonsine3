// I kept this as a simple array to avoid hardcoding HTML
const categories = [
  {
    id: "wooden",
    name: "WOODEN CRAFTS",
    image: "../Pictures/pictures/WoodenCrafts/woodencraft.jpg",
    alt: "Wooden Crafts"
  },
  {
    id: "porcelain",
    name: "PORCELAIN ITEMS",
    image: "../Pictures/pictures/Porcelain/p2.jpg",
    alt: "Porcelain Item"
  },
  {
    id: "flower",
    name: "FLOWER ARRANGEMENTS",
    image: "../Pictures/pictures/FlowerArrangements/f2.png",
    alt: "Flower Arrangements"
  },
  {
    id: "home",
    name: "HOME DECOR",
    image: "../Pictures/pictures/HomeDecor/homedecor.jpg",
    alt: "Home Decor"
  }
];

// Renders category cards dynamically instead of writing HTML manually
function renderCategories() {
  const categoryGrid = document.getElementById("CategoryGrid");
  if (!categoryGrid) return;
  
  // This checks if categories are missing
  if (categories.length === 0) {
    categoryGrid.innerHTML =
      "<p style='text-align: center; padding: 20px; color: #999;'>No categories available</p>";
    return;
  }

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const card = document.createElement("a");
    card.href = `ProductList.html?category=${category.id}`;
    card.className = "CategoryCard";

    card.innerHTML = `
      <div class="ImageBox">
        <img src="${category.image}" alt="${category.alt}" />
      </div>
      <p>${category.name}</p>
    `;

    categoryGrid.appendChild(card);
  });
}


//This normalisez image paths
function resolveImagePath(imagePath)
 {

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (imagePath.startsWith("../")) return imagePath;
  if (!imagePath.startsWith("/")) return "../" + imagePath;
  return imagePath;
  
}

const productGrid = document.getElementById("ProductGrid");
const loader = document.getElementById("Loader");

// This helps to load featured products from JSON
if (productGrid && loader) {
  fetch("../Data/products.json")
    .then((response) => response.json())
    .then((data) => {
      loader.style.display = "none";

      // Manually selected featured products for homepage display
      const featuredProducts = [

        data.products.find((p) => p.id === "flower1"),
        data.products.find((p) => p.id === "home1"),
        data.products.find((p) => p.id === "porcelain1"),
        data.products.find((p) => p.id === "wooden1"),
        data.products.find((p) => p.id === "flower2"),
        data.products.find((p) => p.id === "home3"),
        data.products.find((p) => p.id === "porcelain2"),
        data.products.find((p) => p.id === "wooden2")
        
      ].filter((p) => p !== undefined);

      featuredProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "FeaturedProductCard";

        const imagePath = resolveImagePath(product.image);

        card.innerHTML = `
          <div class="FeaturedProductImage">
            <a href="ProductDetails.html?id=${product.id}">
              <img src="${imagePath}" alt="${product.name}" onerror="this.onerror=null; this.src='../Pictures/LOGO/LOGO.png';" />
            </a>
          </div>
          <h3>${product.name}</h3>
          <p class="FeaturedPrice">Rs.${product.price}</p>
          <button class="FeaturedCartButton" type="button" aria-label="Add to cart" data-product-id="${product.id}">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        `;
        
        // Adds item to cart and supports fallback if shared cart logic is unavailable
        const cartButton = card.querySelector(".FeaturedCartButton");
        cartButton.addEventListener("click", function () {
          if (typeof window.addToCart === "function") {
            window.addToCart(product, 1);
            alert(`${product.name} added to cart!`);
          } else {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find((item) => item.id === product.id);

            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
              });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} added to cart!`);
          }
        });

        productGrid.appendChild(card);
      });
    })
    .catch(() => {
      loader.innerHTML = "Failed to load products.";
    });
}

// Handle search form submission
document.addEventListener("DOMContentLoaded", function () {
  renderCategories();
  
  const searchForm = document.querySelector(".SearchSection");
  const searchInput = document.getElementById("Search");
  
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm) {
        // Redirect to ProductList page with search query parameter
        window.location.href = `ProductList.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
});
