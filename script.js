
const menu = [
  { id:1, name:'Butter Chicken', emoji:'🍛', price:249, desc:'Creamy tomato-based curry with tender chicken pieces', cat:'indian', veg:false, spicy:true, rating:4.8 },
  { id:2, name:'Paneer Tikka', emoji:'🧆', price:199, desc:'Marinated cottage cheese cubes grilled in tandoor', cat:'indian', veg:true, spicy:false, rating:4.7 },
  { id:3, name:'Margherita Pizza', emoji:'🍕', price:289, desc:'Classic tomato, mozzarella, fresh basil on thin crust', cat:'italian', veg:true, spicy:false, rating:4.6 },
  { id:4, name:'Veg Fried Rice', emoji:'🍚', price:179, desc:'Wok-tossed basmati rice with fresh vegetables & soy', cat:'chinese', veg:true, spicy:false, rating:4.5 },
  { id:5, name:'Hakka Noodles', emoji:'🍜', price:169, desc:'Thin noodles tossed with crunchy veggies & sauces', cat:'chinese', veg:true, spicy:true, rating:4.6 },
  { id:6, name:'Gulab Jamun', emoji:'🍮', price:99, desc:'Soft milk-solid dumplings soaked in rose syrup', cat:'dessert', veg:true, spicy:false, rating:4.9 },
  { id:7, name:'Dal Makhani', emoji:'🫕', price:219, desc:'Slow-cooked black lentils in buttery tomato gravy', cat:'indian', veg:true, spicy:false, rating:4.8 },
  { id:8, name:'Chicken Biryani', emoji:'🍖', price:329, desc:'Fragrant basmati layered with spiced chicken', cat:'indian', veg:false, spicy:true, rating:4.9 },
  { id:9, name:'Mango Lassi', emoji:'🥭', price:89, desc:'Chilled blend of yogurt, mango pulp & cardamom', cat:'drinks', veg:true, spicy:false, rating:4.7 },
  { id:10, name:'Cold Coffee', emoji:'☕', price:119, desc:'Rich espresso blended with milk and ice cream', cat:'drinks', veg:true, spicy:false, rating:4.5 },
  { id:11, name:'Penne Arrabbiata', emoji:'🍝', price:259, desc:'Penne in a fiery garlic-tomato sauce with herbs', cat:'italian', veg:true, spicy:true, rating:4.4 },
  { id:12, name:'Chocolate Lava Cake', emoji:'🎂', price:159, desc:'Warm cake with molten chocolate centre, served hot', cat:'dessert', veg:true, spicy:false, rating:4.9 },
];

let cart = [];
let currentCat = 'all';

function renderMenu(cat) {
  const grid = document.getElementById('foodGrid');
  const items = cat === 'all' ? menu : menu.filter(i => i.cat === cat);
  grid.innerHTML = items.map((item, idx) => `
    <div class="food-card" style="animation-delay:${idx * 0.05}s">
      <div class="food-img">
        ${item.veg ? '<span class="badge-veg">VEG</span>' : ''}
        ${item.spicy ? '<span class="badge-spicy">🌶 Spicy</span>' : ''}
        ${item.emoji}
      </div>
      <div class="food-body">
        <div class="food-name">${item.name}</div>
        <div class="food-desc">${item.desc}</div>
        <div class="food-footer">
          <div>
            <div class="food-price">₹${item.price} <span>/ serving</span></div>
            <div class="rating"><span class="star">★</span> ${item.rating}</div>
          </div>
          <button class="add-btn" id="btn-${item.id}" onclick="addToCart(${item.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCat(el, cat) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  currentCat = cat;
  renderMenu(cat);
}

function addToCart(id) {
  const item = menu.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCartUI();
  showToast(`${item.emoji} ${item.name} added!`);
  const btn = document.getElementById('btn-' + id);
  if (btn) {
    btn.textContent = '✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = '+'; btn.classList.remove('added'); }, 1200);
  }
}

function addToCartDirect(name, price, emoji) {
  const fakeId = 99;
  const existing = cart.find(c => c.id === fakeId);
  if (existing) existing.qty++;
  else cart.push({ id: fakeId, name, price, emoji, qty: 1 });
  updateCartUI();
  showToast(`${emoji} ${name} added!`);
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartTotal').textContent = '₹' + total;
  const cc = document.getElementById('cartCount');
  cc.textContent = count;
  cc.classList.add('bump');
  setTimeout(() => cc.classList.remove('bump'), 350);

  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><span class="empty-icon">🍽️</span>Your cart is empty.<br>Add some delicious items!</div>`;
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="ci-emoji">${item.emoji}</span>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">₹${item.price * item.qty}</div>
      </div>
      <div class="ci-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function checkout() {
  if (cart.length === 0) { showToast('🛒 Your cart is empty!'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cart = [];
  updateCartUI();
  toggleCart();
  showToast(`✅ Order placed! ₹${total} charged.`);
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// Init
renderMenu('all');
