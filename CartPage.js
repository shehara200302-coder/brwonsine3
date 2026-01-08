// I use fixed delivary fee
const DELIVERY_FEE = 2500;

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartBox = document.querySelector('.CartBox');
  const emptyMessage = document.getElementById('emptyCartMessage');
  
   // If cart is empty, show empty message
  if (cart.length === 0) {
    if (cartBox) cartBox.innerHTML = '';
    if (emptyMessage) {
      emptyMessage.style.display = 'block';
    }
    updateSummary(0);
    return;
  }
  
  if (emptyMessage) emptyMessage.style.display = 'none';
  
  if (!cartBox) return;
  
  cartBox.innerHTML = '';
  
   // Create a row for each cart item
  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'CartRow';
    row.setAttribute('data-product-id', item.id);
    
    const price = parseFloat(item.price.replace(/,/g, ''));
    const total = price * item.quantity;
    
    row.innerHTML = `
      <div class="ImgBox">
        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div class="RowInfo">
        <div class="PName">${item.name}</div>
        <div class="PPrice">Rs.${item.price}</div>
        <div class="QtyControls">
          <button class="QuantityButton" type="button" aria-label="Decrease Quantity" data-action="decrease" data-product-id="${item.id}">-</button>
          <span class="QuantityNum" data-product-id="${item.id}">${item.quantity}</span>
          <button class="QuantityButton" type="button" aria-label="Increase Quantity" data-action="increase" data-product-id="${item.id}">+</button>
        </div>
        <div class="ItemTotal" style="margin-top: 8px; font-weight: 700; font-size: 16px;">
          Total: Rs.${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <button class="RemoveButton" type="button" style="margin-top: 8px; padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;" data-product-id="${item.id}">
          Remove
        </button>
      </div>
    `;
    
    cartBox.appendChild(row);
  });
  
  setupCartEventListeners();
  updateSummary(calculateSubtotal());
}

// Handles quantity increase, decrease
function setupCartEventListeners() {
  document.querySelectorAll('.QuantityButton').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      const action = this.getAttribute('data-action');
      const quantitySpan = document.querySelector(`.QuantityNum[data-product-id="${productId}"]`);
      let currentQuantity = parseInt(quantitySpan.textContent);
      
      if (action === 'increase') {
        currentQuantity++;
        // I used this code to prevent quantity going below than 1
      } else if (action === 'decrease') {
        currentQuantity = Math.max(1, currentQuantity - 1);
      }
      
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = cart.find(item => item.id === productId);
      
      if (item) {
        if (currentQuantity <= 0) {
          cart = cart.filter(item => item.id !== productId);
        } else {
          item.quantity = currentQuantity;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
      }
    });
  });
  
  document.querySelectorAll('.RemoveButton').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCartItems();
      
      if (typeof window.updateCartIcon === 'function') {
        window.updateCartIcon();
      }
    });
  });
}

// This code is Updating subtotal, delivery fee
function updateSummary(subtotal) {
  const total = subtotal + DELIVERY_FEE;
  
  const subtotalEl = document.querySelector('.SumValue[data-type="subtotal"]');
  const deliveryEl = document.querySelector('.SumValue[data-type="delivery"]');
  const totalEl = document.querySelector('.SumValue[data-type="total"]');
  
  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(subtotal);
  }
  if (deliveryEl) {
    deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  }
  if (totalEl) {
    totalEl.textContent = formatPrice(total);
  }
}

function formatPrice(amount) {
  return 'Rs.' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateSubtotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/,/g, ''));
    return total + (price * item.quantity);
  }, 0);
}

// sync icon when page is loading
document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  
  if (typeof updateCartIcon === 'function') {
    updateCartIcon();
  }
});
