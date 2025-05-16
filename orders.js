// Menu items data
const menuItems = [
    {
        id: 1,
        name: "Classic Milk Tea",
        price: 69.25,
        image: "classic.png"
    },
    {
        id: 2,
        name: "Taro Milk Tea",
        price: 69.25,
        image: "taro.png"
    },
    {
        id: 3,
        name: "Thai Milk Tea",
        price: 69.25,
        image: "thai.png"
    },
    {
        id: 4,
        name: "Matcha Milk Tea",
        price: 69.25,
        image: "matcha.png"
    },
    {
        id: 5,
        name: "Honeydew Milk",
        price: 69.25,
        image: "honeydew.png"
    }
];

// Current selection state
let currentSelection = {
    item: null,
    size: 'small',
    sweetness: '50',
    ice: 'no',
    addOns: new Set(),
    quantity: 4
};

// Cart data
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems();
    setupEventListeners();
    loadCart();
});

// Display menu items
function displayMenuItems() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item ${currentSelection.item?.id === item.id ? 'selected' : ''}" 
             onclick="selectMenuItem(${item.id})">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">₱${item.price.toFixed(2)}</div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Size buttons
    document.querySelectorAll('[data-size]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-size]').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            currentSelection.size = button.dataset.size;
            updateOrderSummary();
        });
    });

    // Sweetness buttons
    document.querySelectorAll('[data-sweetness]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-sweetness]').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            currentSelection.sweetness = button.dataset.sweetness;
            updateOrderSummary();
        });
    });

    // Ice level buttons
    document.querySelectorAll('[data-ice]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-ice]').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            currentSelection.ice = button.dataset.ice;
            updateOrderSummary();
        });
    });

    // Add-ons checkboxes
    document.querySelectorAll('.add-on-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                currentSelection.addOns.add(checkbox.id);
            } else {
                currentSelection.addOns.delete(checkbox.id);
            }
            updateOrderSummary();
        });
    });

    // Search functionality
    document.querySelector('.search-bar input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Select menu item
function selectMenuItem(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    currentSelection.item = item;
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.classList.toggle('selected', menuItem.querySelector('h3').textContent === item.name);
    });
    updateOrderSummary();
}

// Quantity controls
function incrementQuantity() {
    currentSelection.quantity++;
    document.getElementById('quantity').textContent = currentSelection.quantity;
    updateOrderSummary();
}

function decrementQuantity() {
    if (currentSelection.quantity > 1) {
        currentSelection.quantity--;
        document.getElementById('quantity').textContent = currentSelection.quantity;
        updateOrderSummary();
    }
}

// Calculate current item total
function calculateItemTotal() {
    if (!currentSelection.item) return 0;

    let total = currentSelection.item.price;

    // Add size price
    if (currentSelection.size === 'medium') total += 30;
    if (currentSelection.size === 'large') total += 40;

    // Add toppings price
    total += currentSelection.addOns.size * 15;

    // Multiply by quantity
    total *= currentSelection.quantity;

    return total;
}

// Add to cart
function addToCart() {
    if (!currentSelection.item) {
        alert('Please select a milk tea first!');
        return;
    }

    const cartItem = {
        id: Date.now(),
        name: currentSelection.item.name,
        size: currentSelection.size,
        sweetness: currentSelection.sweetness,
        ice: currentSelection.ice,
        addOns: Array.from(currentSelection.addOns),
        quantity: currentSelection.quantity,
        price: calculateItemTotal()
    };

    cart.push(cartItem);
    saveCart();
    updateOrderSummary();
    
    // Reset selection
    currentSelection.addOns.clear();
    document.querySelectorAll('.add-on-item input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('milktea_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('milktea_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateOrderSummary();
    }
}

// Update order summary
function updateOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<div class="empty-cart">No items in order yet</div>';
    } else {
        orderItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong> (${item.size})<br>
                    <small>
                        ${item.sweetness}% sugar, ${item.ice} ice<br>
                        ${item.addOns.length ? 'Add-ons: ' + item.addOns.join(', ') : 'No add-ons'}<br>
                        Quantity: ${item.quantity}
                    </small>
                </div>
                <div>
                    <div>₱${item.price.toFixed(2)}</div>
                    <button onclick="removeFromCart(${item.id})" style="color: red; background: none; border: none; cursor: pointer;">×</button>
                </div>
            </div>
        `).join('');
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = `₱${subtotal.toFixed(2)}`;
    document.querySelector('.summary-item:nth-child(4) span:last-child').textContent = `₱${tax.toFixed(2)}`;
    document.querySelector('.total-amount span:last-child').textContent = `₱${total.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateOrderSummary();
}

// Proceed to payment
function proceedToPayment() {
    if (cart.length === 0) {
        alert('Please add items to your order first.');
        return;
    }

    const customerName = document.querySelector('.customer-name input').value.trim();
    if (!customerName) {
        alert('Please enter customer name.');
        return;
    }
    
    // Save current order to localStorage for payment page
    localStorage.setItem('current_order', JSON.stringify({
        items: cart,
        customerName,
        subtotal: cart.reduce((sum, item) => sum + item.price, 0),
        tax: cart.reduce((sum, item) => sum + item.price, 0) * 0.08,
        total: cart.reduce((sum, item) => sum + item.price, 0) * 1.08,
        timestamp: new Date().toISOString()
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
} 