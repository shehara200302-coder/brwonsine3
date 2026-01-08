// Get the product id from the URL
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function resolveImagePath(imagePath) {
  // If the image is already a full URL, use it as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  const isFileProtocol = window.location.protocol === 'file:';
  const currentPath = window.location.pathname || window.location.href;

  if (imagePath.startsWith('../')) {
    if (isFileProtocol) {
      const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
      const resolvedPath = basePath.substring(0, basePath.lastIndexOf('/')) + imagePath.substring(2);
      return resolvedPath;
    }
    return imagePath;
  }

   // JSON uses "../" paths, so I handle it specially for file mode
  if (imagePath.startsWith('/')) {
    if (isFileProtocol) {
      const basePath = currentPath.substring(0, currentPath.indexOf('/Index.html'));
      return basePath + imagePath;
    }
    return imagePath;
  }

  // If it’s file mode and a normal relative path, I rebuild it based on current folder
  if (isFileProtocol) {
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    return basePath + '/../' + imagePath;
  }

  return '../' + imagePath;
}

async function loadProduct() {
  const productId = getProductId();
   
  // If someone opens the page without an id, show a simple fallback message
  if (!productId) {
    document.getElementById('loader').innerHTML = '<p>Product not found. <a href="ProductList.html?category=flower">Return to Shop</a></p>';
    return;
  }

  try {
    const response = await fetch('../Data/products.json');
    const data = await response.json();
    
    const product = data.products.find(p => p.id === productId);
    
    if (!product) {
      document.getElementById('loader').innerHTML = '<p>Product not found. <a href="ProductList.html?category=flower">Return to Shop</a></p>';
      return;
    }

    document.title = `${product.name} | Loom & Lane`;

    const imagePath = resolveImagePath(product.image);
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `Rs.${product.price}`;
    const productImage = document.getElementById('productImage');
    productImage.src = imagePath;
    productImage.alt = product.name;
    
    // If image fails, show logo instead of broken image icon
    productImage.onerror = function() {
      this.onerror = null;
      this.src = '../Pictures/LOGO/LOGO.png';
    };
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productDimensions').textContent = 
      `Length: ${product.dimensions.length}, Width: ${product.dimensions.width}, Height: ${product.dimensions.height}`;
    document.getElementById('productMaterial').textContent = `Material: ${product.material}`;
    document.getElementById('productFinish').textContent = `Finish: ${product.finish}`;
    document.getElementById('fullDescription').textContent = product.description;

    document.getElementById('loader').style.display = 'none';
    document.getElementById('productSection').style.display = 'grid';
    document.getElementById('bottomSection').style.display = 'grid';

    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Some times quantity input might be empty, so default to 1
        const quantity = parseInt(document.getElementById('Quantity').value) || 1;
        
        if (typeof window.addToCart === 'function') {
          window.addToCart(product, quantity);
          alert(`${product.name} (${quantity}x) added to cart!`);
        } else {
          // Sore cart manually in localStorage
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingItem = cart.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.push({

              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: quantity

            });
          }
          localStorage.setItem('cart', JSON.stringify(cart));

           // Update cart badge if function is available
          if (typeof window.updateCartIcon === 'function') {
            window.updateCartIcon();
          }
          alert(`${product.name} (${quantity}x) added to cart!`);
        }
      });
    }

  } catch (error) {
    document.getElementById('loader').innerHTML = '<p>Error loading product. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProduct);
