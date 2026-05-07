// ── 1. PRODUCT CLASS ────────────────────────────────────────
class Product {
    constructor(id, name, price, image, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
    }
}

// ── API CONFIG ───────────────────────────────────────────────
const API_BASE = 'http://localhost:8080/api';

// Will be filled by fetchProducts() on page load
let products = [];

// ── 3. CART STATE ────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline' : 'none';
}

// ── 4. ADD TO CART HELPER ────────────────────────────────────
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.image,
                qty: 1
            });
        }
    }
    saveCart();
    updateCartBadge();
}

// ── SECURE REQUEST HELPER ────────────────────────────────────
async function secureRequest(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 401) {
        alert('Please log in first!');
        window.location.href = 'signup.html';
        return null;
    }
    if (response.status === 403) {
        alert('Access Denied! You do not have permission for this.');
        return null;
    }
    return response;
}

// ============================================================
//  FETCH PRODUCTS FROM API  (Lab 8 - Task 5)
// ============================================================
async function fetchProducts(category = null) {
    let url = `${API_BASE}/products`;
    if (category) url += `?category=${category}`;

    try {
        const response = await secureRequest(url);
        if (!response) return [];

        if (!response.ok) {
            if (response.status === 404)
                throw new Error('Products not found (404)');
            if (response.status >= 500)
                throw new Error(`Server error (${response.status})`);
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Fetched ${data.length} products from API`, data);
        return data;

    } catch (error) {
        console.error('fetchProducts failed:', error.message);
        return [];
    }
}

// ============================================================
//  TASK 2 – Dynamic Product Rendering  (product.html)
// ============================================================
async function initProductsPage() {
    const productContainer = document.querySelector('.products-grid');
    if (!productContainer) return;

    productContainer.innerHTML = '<p>Loading products...</p>';

    products = await fetchProducts();

    if (products.length === 0) {
        productContainer.innerHTML =
            '<p>No products found. Is the backend running on port 8080?</p>';
        return;
    }

    function getActiveCategories() {
        const checked = document.querySelectorAll('input[name="category"]:checked');
        return Array.from(checked).map(cb => cb.value);
    }
    function getActivePriceFilter() {
        const selected = document.querySelector('input[name="price"]:checked');
        return selected ? selected.value : null;
    }

    function renderProducts() {
        productContainer.innerHTML = '';

        const activeCategories = getActiveCategories();
        const priceFilter = getActivePriceFilter();

        const filtered = products.filter(product => {
            const categoryMatch = activeCategories.length === 0 ||
                activeCategories.includes(product.categoryName);
            const priceMatch = !priceFilter ||
                (priceFilter === 'low' && product.price < 500) ||
                (priceFilter === 'high' && product.price >= 500);
            return categoryMatch && priceMatch;
        });

        if (filtered.length === 0) {
            const msg = document.createElement('p');
            msg.appendChild(document.createTextNode('No products match your filters.'));
            productContainer.appendChild(msg);
            return;
        }

        filtered.forEach(product => {
            const article = document.createElement('article');
            article.className = 'product-card';
            article.setAttribute('data-id', product.id);

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;

            const h3 = document.createElement('h3');
            h3.appendChild(document.createTextNode(product.name));

            const pPrice = document.createElement('p');
            pPrice.className = 'price';
            pPrice.appendChild(document.createTextNode('₱' + product.price));

            const btnCart = document.createElement('button');
            btnCart.className = 'add-to-cart';
            btnCart.setAttribute('data-action', 'add');
            btnCart.setAttribute('data-id', product.id);
            btnCart.appendChild(document.createTextNode('Add to Cart'));

            const btnDetails = document.createElement('button');
            btnDetails.className = 'add-to-details';
            btnDetails.setAttribute('data-action', 'details');
            btnDetails.setAttribute('data-id', product.id);
            btnDetails.appendChild(document.createTextNode('Details'));

            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(pPrice);
            article.appendChild(btnCart);
            article.appendChild(document.createElement('br'));
            article.appendChild(document.createElement('br'));
            article.appendChild(btnDetails);

            productContainer.appendChild(article);
        });
    }

    renderProducts();

    productContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const id = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');

        if (action === 'add') {
            addToCart(id);

            const card = btn.closest('.product-card');
            if (card) {
                card.classList.add('bounce');
                card.classList.add('added-animation');
                setTimeout(() => {
                    card.classList.remove('bounce');
                    card.classList.remove('added-animation');
                }, 600);
            }

            btn.textContent = '✓ Added!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.disabled = false;
            }, 1200);
        }

        if (action === 'details') {
            window.location.href = 'detail.html';
        }
    });

    document.querySelectorAll('input[name="category"], input[name="price"]').forEach(input => {
        input.addEventListener('change', renderProducts);
    });
}

// ============================================================
//  TASK 3 – Cart Page  (cart.html)
// ============================================================
function renderCart() {
    const container = document.querySelector('.cart-items-dynamic');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        const msg = document.createElement('p');
        msg.appendChild(document.createTextNode('Your cart is empty.'));
        const link = document.createElement('a');
        link.href = 'product.html';
        link.appendChild(document.createTextNode('← Continue Shopping'));
        container.appendChild(msg);
        container.appendChild(link);
        updateSummary(0);
        return;
    }

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.setAttribute('data-id', item.id);

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;

        const info = document.createElement('div');
        info.className = 'item-info';

        const h4 = document.createElement('h4');
        h4.appendChild(document.createTextNode(item.name));

        const pPrice = document.createElement('p');
        pPrice.appendChild(document.createTextNode('Price: ₱' + item.price));

        const pTotal = document.createElement('p');
        pTotal.className = 'line-total';
        pTotal.appendChild(document.createTextNode('Subtotal: ₱' + (item.price * item.qty)));

        info.appendChild(h4);
        info.appendChild(pPrice);
        info.appendChild(pTotal);

        const btnMinus = document.createElement('button');
        btnMinus.className = 'qty-btn';
        btnMinus.setAttribute('data-action', 'decrease');
        btnMinus.setAttribute('data-id', item.id);
        btnMinus.appendChild(document.createTextNode('−'));

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '0';
        qtyInput.value = item.qty;
        qtyInput.className = 'quantity-input';
        qtyInput.setAttribute('data-qty-id', item.id);

        const btnPlus = document.createElement('button');
        btnPlus.className = 'qty-btn';
        btnPlus.setAttribute('data-action', 'increase');
        btnPlus.setAttribute('data-id', item.id);
        btnPlus.appendChild(document.createTextNode('+'));

        const btnRemove = document.createElement('button');
        btnRemove.className = 'add-to-cart';
        btnRemove.setAttribute('data-action', 'remove');
        btnRemove.setAttribute('data-id', item.id);
        btnRemove.appendChild(document.createTextNode('Remove'));

        const btnCheckout = document.createElement('button');
        btnCheckout.className = 'add-to-cart';
        btnCheckout.setAttribute('data-action', 'checkout');
        btnCheckout.appendChild(document.createTextNode('Checkout'));

        li.appendChild(img);
        li.appendChild(info);
        li.appendChild(btnMinus);
        li.appendChild(qtyInput);
        li.appendChild(btnPlus);
        li.appendChild(document.createElement('br'));
        li.appendChild(document.createElement('br'));
        li.appendChild(btnRemove);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(btnCheckout);

        container.appendChild(li);
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const shipping = subtotal > 0 ? 100 : 0;
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    if (subtotalEl) subtotalEl.textContent = '₱' + subtotal;
    if (shippingEl) shippingEl.textContent = '₱' + shipping;
    if (totalEl) totalEl.textContent = '₱' + (subtotal + shipping);
}

function initCartPage() {
    const container = document.querySelector('.cart-items-dynamic');
    if (!container) return;

    renderCart();

    container.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const id = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');

        if (action === 'increase') {
            const item = cart.find(i => i.id === id);
            if (item) item.qty += 1;
            saveCart(); renderCart();
        }

        if (action === 'decrease') {
            const item = cart.find(i => i.id === id);
            if (item && item.qty > 1) {
                item.qty -= 1;
            } else {
                const idx = cart.findIndex(i => i.id === id);
                if (idx > -1) cart.splice(idx, 1);
            }
            saveCart(); renderCart();
        }

        if (action === 'remove') {
            const idx = cart.findIndex(i => i.id === id);
            if (idx > -1) cart.splice(idx, 1);
            saveCart(); renderCart();
        }

        if (action === 'checkout') {
            window.location.href = 'checkout.html';
        }
    });

    container.addEventListener('change', function (e) {
        const input = e.target.closest('input[data-qty-id]');
        if (!input) return;

        const id = parseInt(input.getAttribute('data-qty-id'));
        const newQty = parseInt(input.value);

        if (isNaN(newQty) || newQty <= 0) {
            cart = cart.filter(i => i.id !== id);
        } else {
            const item = cart.find(i => i.id === id);
            if (item) item.qty = newQty;
        }
        saveCart(); renderCart();
    });

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (confirm('Clear your entire cart?')) {
                cart = []; saveCart(); renderCart();
            }
        });
    }
}

// ============================================================
//  TASK 4 – Checkout Form Validation  (checkout.html)
// ============================================================
function initCheckoutPage() {
    const form = document.querySelector('#checkout-form');
    if (!form) return;

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 0 ? 100 : 0;
    const itemsEl = document.getElementById('summary-items');
    const shippEl = document.getElementById('co-shipping');
    const totalEl = document.getElementById('co-total');
    if (itemsEl) itemsEl.textContent = '₱' + subtotal;
    if (shippEl) shippEl.textContent = '₱' + shipping;
    if (totalEl) totalEl.textContent = '₱' + (subtotal + shipping);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;

        function setError(fieldId, message) {
            const field = form.querySelector('#' + fieldId);
            const errEl = form.querySelector('#' + fieldId + '-error');
            if (field) field.classList.add('error');
            if (errEl) errEl.textContent = message;
            valid = false;
        }
        function clearError(fieldId) {
            const field = form.querySelector('#' + fieldId);
            const errEl = form.querySelector('#' + fieldId + '-error');
            if (field) field.classList.remove('error');
            if (errEl) errEl.textContent = '';
        }

        ['fullname', 'street', 'zip'].forEach(id => clearError(id));

        const fullname = form.querySelector('#fullname');
        const street = form.querySelector('#street');
        const zip = form.querySelector('#zip');
        const payment = form.querySelector('input[name="payment"]:checked');

        if (!fullname.value.trim()) setError('fullname', 'Full name is required.');
        if (!street.value.trim()) setError('street', 'Street address is required.');
        if (!zip.value.trim() || !/^\d{4,6}$/.test(zip.value.trim()))
            setError('zip', 'Enter a valid ZIP code (4–6 digits).');

        const payErr = form.querySelector('#payment-error');
        if (!payment) {
            if (payErr) payErr.textContent = 'Please select a payment method.';
            valid = false;
        } else {
            if (payErr) payErr.textContent = '';
        }

        if (valid) {
            console.log('Order placed successfully!');
            cart = []; saveCart();
            window.location.href = 'landing.html';
        }
    });

    form.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error');
            const errEl = form.querySelector('#' + this.id + '-error');
            if (errEl) errEl.textContent = '';
        });
    });
}

// ============================================================
//  TASK 5 – Account Page  (account.html)
// ============================================================
function initAccountPage() {
    const greeting = document.querySelector('#account-greeting');
    if (!greeting) return;

    const currentUser = {
        name: 'Guest Shopper',
        orderHistory: [
            {
                id: '#1001', date: 'Jan 2026', total: 473, status: 'Delivered',
                items: [{ name: 'Spring Autumn Corduroy Jacket Men', qty: 1, price: 473 }]
            },
            {
                id: '#1002', date: 'Feb 2026', total: 250, status: 'Delivered',
                items: [{ name: 'TALA TUBE MAXI DRESS by Shelovestoshop', qty: 1, price: 250 }]
            },
            {
                id: '#1003', date: 'Mar 2026', total: 699, status: 'In Transit',
                items: [{ name: 'Classic Denim Jacket Women', qty: 1, price: 699 }]
            }
        ]
    };

    greeting.textContent = 'Hi, ' + currentUser.name + '! Ready to explore?';

    const ordersContainer = document.querySelector('#orders-container');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = '';

    currentUser.orderHistory.forEach(order => {
        const details = document.createElement('details');

        const summary = document.createElement('summary');
        summary.appendChild(document.createTextNode(
            'Order ' + order.id + ' – ' + order.date +
            '  |  ₱' + order.total + '  |  ' + order.status
        ));
        details.appendChild(summary);

        summary.addEventListener('click', function () {
            if (details.querySelector('.order-detail-body')) return;

            const div = document.createElement('div');
            div.className = 'order-detail-body';

            order.items.forEach(item => {
                const p = document.createElement('p');
                p.appendChild(document.createTextNode(
                    item.name + ' × ' + item.qty + '  —  ₱' + item.price
                ));
                div.appendChild(p);
            });

            details.appendChild(div);
        });

        ordersContainer.appendChild(details);
        ordersContainer.appendChild(document.createElement('br'));
    });
}

// ============================================================
//  PAGE ROUTER
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();

    const path = window.location.pathname;

    if (path.includes('product')) initProductsPage();
    if (path.includes('cart')) initCartPage();
    if (path.includes('checkout')) initCheckoutPage();
    if (path.includes('account')) initAccountPage();
});