const categoryNames = {
  'flower': 'FLOWER ARRANGEMENTS',
  'home': 'HOME DECOR',
  'porcelain': 'PORCELAIN ITEMS',
  'wooden': 'WOODEN CRAFTS'
};

// I used this to store all products loaded from JSON
let allProducts = [];

// This is for filtering products
let filteredProducts = [];

// Defaults to "flower"
function getCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category') || 'flower';
}

// Get search query from URL
function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('search') || '';
}

// Resolves images paths correctly
function resolveImagePath(imagePath) {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // I used this to handle base64 or blob images
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  const isFileProtocol = window.location.protocol === 'file:';
  const currentPath = window.location.pathname || window.location.href;
 
    // to handle relative paths 
  if (imagePath.startsWith('../')) {
    if (isFileProtocol) {
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      const resolvedPath = basePath.substring(0, basePath.lastIndexOf('/')) + imagePath.substring(2);
      return resolvedPath;
    }
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    if (isFileProtocol) {
      const basePath = currentPath.substring(0, currentPath.indexOf('/Index.html'));
      return basePath + imagePath;
    }
    return imagePath;
  }

   // Default handling for local file
  if (isFileProtocol) {
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    return basePath + '/../' + imagePath;
  }

  return '../' + imagePath;
}

function parsePrice(priceString) {
  return parseFloat(String(priceString).replace(/,/g, ''));
}

function formatPrice(amount) {
  return 'Rs.' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setupPriceSlider(products) {
  if (products.length === 0) return;

  const prices = products.map(p => parsePrice(p.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const roundedMax = Math.ceil(maxPrice / 1000) * 1000;

  const slider = document.getElementById('PriceSlider') || document.getElementById('priceSlider');
  const minPriceEl = document.getElementById('MinPrice') || document.getElementById('minPrice');
  const maxPriceEl = document.getElementById('MaxPrice') || document.getElementById('maxPrice');
  const sliderValueEl = document.getElementById('SliderValue') || document.getElementById('sliderValue');

  if (slider && minPriceEl && maxPriceEl && sliderValueEl) {
    slider.min = 0;
    slider.max = roundedMax;
    slider.value = roundedMax;
    slider.step = 1000;

    minPriceEl.textContent = formatPrice(0);
    maxPriceEl.textContent = formatPrice(roundedMax);
    sliderValueEl.textContent = formatPrice(roundedMax);

    slider.addEventListener('input', function() {
      const maxValue = parseFloat(this.value);
      sliderValueEl.textContent = formatPrice(maxValue);
      filterProductsByPrice(maxValue);
    });
  }
}

// Search function to filter products by search term
function searchProducts(searchTerm) {
  if (!searchTerm) return allProducts;
  
  const term = searchTerm.toLowerCase();
  return allProducts.filter(p => {
    const name = (p.name || '').toLowerCase();
    const description = (p.description || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const material = (p.material || '').toLowerCase();
    
    return name.includes(term) || 
           description.includes(term) || 
           category.includes(term) ||
           material.includes(term);
  });
}

// To filter products based on selected category, search query, and maximum price
function filterProductsByPrice(maxPrice) {
  const category = getCategory();
  const searchQuery = getSearchQuery();
  
  let productsToFilter = allProducts;
  
  // If there's a search query, filter by search first
  if (searchQuery) {
    productsToFilter = searchProducts(searchQuery);
  }
  
  // Filter by category if no search query (or apply category filter along with search)
  if (!searchQuery) {
    productsToFilter = productsToFilter.filter(p => p.category === category);
  }
  
  // Apply price filter
  filteredProducts = productsToFilter.filter(p => {
    const price = parsePrice(p.price);
    return price <= maxPrice;
  });

  renderProducts(filteredProducts);
}

function renderProducts(products) {
  const productGrid = document.getElementById('ProductGrid') || document.getElementById('productGrid');
  if (!productGrid) return;
  productGrid.innerHTML = '';


  if (products.length === 0) {
    const searchQuery = getSearchQuery();
    const message = searchQuery 
      ? `<p>No products found matching "${searchQuery}".</p>`
      : '<p>No products found in this price range.</p>';
    productGrid.innerHTML = `<div style="text-align: center; padding: 40px; grid-column: 1 / -1;">${message}</div>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'Product-Card';

    const imagePath = resolveImagePath(product.image);

      // Product card structure
    card.innerHTML = `
      <div class="Product-Image">
        <a href="ProductDetails.html?id=${product.id}">
          <img src="${imagePath}" alt="${product.name}" onerror="this.onerror=null; this.src='/Pictures/LOGO/LOGO.png';" />
        </a>
      </div>
      <h3>${String(product.name || '').toUpperCase()}</h3>
      <p class="Price">Rs.${product.price}</p>
      <button class="Cart-Button" type="button" aria-label="Add to cart" data-product-id="${product.id}">
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
    `;

    const cartButton = card.querySelector('.Cart-Button');
    cartButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (typeof window.addToCart === 'function') {
        window.addToCart(product, 1);
        alert(`${product.name} added to cart!`);
      } else {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
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
        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof window.updateCartIcon === 'function') {
          window.updateCartIcon();
        }
        alert(`${product.name} added to cart!`);
      }
    });

    productGrid.appendChild(card);
  });
}


// To load products from JSON 
async function loadProducts() {
  const category = getCategory();
  const searchQuery = getSearchQuery();
  const productGrid = document.getElementById('ProductGrid') || document.getElementById('productGrid');
  const categoryTitle = document.getElementById('CategoryTitle') || document.getElementById('categoryTitle');

  try {
    // To fetch product data
    const response = await fetch('../Data/products.json');
    const data = await response.json();

    allProducts = Array.isArray(data) ? data : (data.products || []);
    
    // If there's a search query, filter by search; otherwise filter by category
    if (searchQuery) {
      filteredProducts = searchProducts(searchQuery);
      // Update page title and heading for search results
      document.title = `Search: "${searchQuery}" | Loom & Lane`;
      if (categoryTitle) categoryTitle.textContent = `Search Results: "${searchQuery}"`;
    } else {
      filteredProducts = allProducts.filter(p => p.category === category);
      const categoryName = categoryNames[category] || 'PRODUCTS';
      // To update page title and heading
      document.title = `${categoryName} | Loom & Lane`;
      if (categoryTitle) categoryTitle.textContent = `Category : ${categoryName}`;

      // Highlight active category only if not searching
      document.querySelectorAll('.SideList a, .Side-List a').forEach(link => {
        link.classList.remove('Active');
      });
      const activeLink = document.getElementById(`Link${category.charAt(0).toUpperCase() + category.slice(1)}`) || document.getElementById(`link-${category}`);
      if (activeLink) {
        activeLink.classList.add('Active');
      }
    }

    setupPriceSlider(filteredProducts);
    renderProducts(filteredProducts);
  } catch (error) {
    productGrid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1 / -1;"><p>Error loading products. Please try again later.</p></div>';
  }
}

// Handle search form submission on ProductList page
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  
  const searchForm = document.querySelector('.SearchSection');
  const searchInput = document.getElementById('Search');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm) {
        // Redirect to ProductList page with search query parameter
        window.location.href = `ProductList.html?search=${encodeURIComponent(searchTerm)}`;
      } else {
        // If empty, redirect to default category
        const category = getCategory();
        window.location.href = `ProductList.html?category=${category}`;
      }
    });
    
    // Pre-fill search input if there's a search query in URL
    const searchQuery = getSearchQuery();
    if (searchInput && searchQuery) {
      searchInput.value = searchQuery;
    }
  }
});
