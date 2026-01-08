// Resolves image paths correctly
function resolveImagePath(imagePath) {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Handle base64 or blob images
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Handle relative paths
  if (imagePath.startsWith('../')) {
    return imagePath;
  }

  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Default handling for local file
  return '../' + imagePath;
}

// Format price for display
function formatPrice(amount) {
  return 'Rs.' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Load and display cart items on order confirmation page
function loadOrderItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemsContainer = document.querySelector('.Confirm-Items');
  
  if (!itemsContainer) return;
  
  // Clear existing placeholder items
  itemsContainer.innerHTML = '';
  
  // If cart is empty, show message
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div style="text-align: center; padding: 40px;"><p>No items in this order.</p></div>';
    return;
  }
  
  // Create item rows for each cart item
  cart.forEach((item) => {
    const itemRow = document.createElement('div');
    itemRow.className = 'Item-Row';
    
    const price = parseFloat(item.price.replace(/,/g, ''));
    const total = price * item.quantity;
    const imagePath = resolveImagePath(item.image);
    
    itemRow.innerHTML = `
      <div class="Item-Img">
        <img src="${imagePath}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='../Pictures/LOGO/LOGO.png';" />
      </div>
      <div class="Item-Mid">
        <p class="Item-Name">${item.name}</p>
        <p class="Item-Quantity">Quantity: ${item.quantity}</p>
      </div>
      <div class="Item-Price">${formatPrice(total)}</div>
    `;
    
    itemsContainer.appendChild(itemRow);
  });
}

// Generate and display order ID (format: LL-YYYY-MMDD)
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  // Format: LL-YYYY-MMDD with a random suffix for uniqueness
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
  const orderId = `LL-${year}-${month}${day}-${randomSuffix}`;
  
  const orderIdElement = document.querySelector('.Crder-Cd');
  if (orderIdElement) {
    orderIdElement.textContent = `Order ID: ${orderId}`;
  }
}

// Calculate estimated delivery date (3-5 days from now)
function calculateDeliveryDate() {
  const now = new Date();
  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + 5); // 5 days from now
  
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[deliveryDate.getMonth()];
  const day = deliveryDate.getDate();
  
  // Get ordinal suffix (st, nd, rd, th)
  let suffix = 'th';
  if (day % 10 === 1 && day % 100 !== 11) suffix = 'st';
  else if (day % 10 === 2 && day % 100 !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day % 100 !== 13) suffix = 'rd';
  
  const deliveryElement = document.querySelector('.Delivery-Estimate p:last-child');
  if (deliveryElement) {
    deliveryElement.innerHTML = `${month} ${day}<sup>${suffix}</sup>`;
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadOrderItems();
  generateOrderId();
  calculateDeliveryDate();
});

