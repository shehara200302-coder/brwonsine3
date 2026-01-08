// Read cart from localStorage 
function getCart() {

  return JSON.parse(localStorage.getItem('cart')) || [];

}

function saveCart(cart) {
  // Save changes and refresh cart badge on header
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIcon();

}

// Global function so product pages can call addToCart
window.addToCart = function(product, quantity) {
  let cart = getCart();
  
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
  
  saveCart(cart);
  return cart;
};

function removeFromCart(productId) {

  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;

}

function updateQuantity(productId, newQuantity) {

  if (newQuantity <= 0) {
    return removeFromCart(productId);
  }
  
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
  }
  
  return cart;

}

function getCartCount() {

  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);

}
// To calculate total
function calculateSubtotal() {
  
  const cart = getCart();
  return cart.reduce((total, item) => {

    const price = parseFloat(item.price.replace(/,/g, ''));
    return total + (price * item.quantity);

  }, 0);
}

function formatPrice(amount) {

  return 'Rs.' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

}

function updateCartIcon() {
  // Update all cart badges
  const cartIcons = document.querySelectorAll('.CartIconBadge, .Cart-Icon-Badge');
  const count = getCartCount();
  
  cartIcons.forEach(badge => {
    if (count > 0) {

      badge.textContent = count;
      badge.style.display = 'flex';

    } else {

      badge.style.display = 'none';

    }
  });
}

window.updateCartIcon = updateCartIcon;
// I added this to ensure the cart badge is correct
document.addEventListener('DOMContentLoaded', updateCartIcon);
