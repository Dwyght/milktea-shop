document.addEventListener('DOMContentLoaded', () => {
    // Initialize state
    let state = {
        selectedDrink: null,
        size: 'Small',
        sweetness: '50%',
        ice: 'No Ice',
        addons: [],
        quantity: 1,
        cart: [],
        customerName: ''
    };

    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
        updateOrderSummary();
    }

    // Menu item selection
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            state.selectedDrink = {
                name: item.querySelector('h3').textContent,
                price: parseFloat(item.querySelector('p').textContent.replace('₱', ''))
            };
        });
    });

    // Size selection
    const sizeButtons = document.querySelectorAll('.size-options button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            state.size = button.textContent.split(' ')[0];
        });
    });

    // Sweetness selection
    const sweetnessButtons = document.querySelectorAll('.sweetness-options button');
    sweetnessButtons.forEach(button => {
        button.addEventListener('click', () => {
            sweetnessButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            state.sweetness = button.textContent;
        });
    });

    // Ice level selection
    const iceButtons = document.querySelectorAll('.ice-options button');
    iceButtons.forEach(button => {
        button.addEventListener('click', () => {
            iceButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            state.ice = button.textContent;
        });
    });

    // Add-ons selection
    const addonCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const addonName = checkbox.parentElement.textContent.trim();
            if (checkbox.checked) {
                state.addons.push(addonName);
            } else {
                state.addons = state.addons.filter(addon => addon !== addonName);
            }
        });
    });

    // Quantity control
    const quantityElement = document.querySelector('.quantity');
    const minusButton = document.querySelector('.quantity-btn.minus');
    const plusButton = document.querySelector('.quantity-btn.plus');

    minusButton.addEventListener('click', () => {
        if (state.quantity > 1) {
            state.quantity--;
            quantityElement.textContent = state.quantity;
        }
    });

    plusButton.addEventListener('click', () => {
        state.quantity++;
        quantityElement.textContent = state.quantity;
    });

    // Add to cart functionality
    const addToCartButton = document.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => {
        if (!state.selectedDrink) {
            alert('Please select a drink first!');
            return;
        }

        const item = {
            drink: state.selectedDrink.name,
            size: state.size,
            sweetness: state.sweetness,
            ice: state.ice,
            addons: [...state.addons],
            quantity: state.quantity,
            basePrice: state.selectedDrink.price,
            totalPrice: calculateItemTotal()
        };

        state.cart.push(item);
        localStorage.setItem('cart', JSON.stringify(state.cart));
        updateOrderSummary();
        resetSelections();
    });

    // Calculate item total
    function calculateItemTotal() {
        let total = state.selectedDrink.price;
        
        // Add size premium
        if (state.size === 'Medium') total += 30;
        if (state.size === 'Large') total += 40;
        
        // Add add-ons cost (₱15 each)
        total += state.addons.length * 15;
        
        // Multiply by quantity
        total *= state.quantity;
        
        return total;
    }

    // Update order summary
    function updateOrderSummary() {
        const orderItems = document.querySelector('.order-items');
        const subtotalElement = document.querySelector('.subtotal span:last-child');
        const taxElement = document.querySelector('.tax span:last-child');
        const totalElement = document.querySelector('.total span:last-child');

        // Clear existing items
        orderItems.innerHTML = '';

        if (state.cart.length === 0) {
            orderItems.innerHTML = '<p class="empty-message">No items in order yet</p>';
            subtotalElement.textContent = '₱0.00';
            taxElement.textContent = '₱0.00';
            totalElement.textContent = '₱0.00';
            return;
        }

        // Add cart items
        state.cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-header">
                    <h4>${item.drink}</h4>
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
                <p>Size: ${item.size}</p>
                <p>Sweetness: ${item.sweetness}</p>
                <p>Ice: ${item.ice}</p>
                ${item.addons.length ? `<p>Add-ons: ${item.addons.join(', ')}</p>` : ''}
                <p>Quantity: ${item.quantity}</p>
                <p class="item-price">₱${item.totalPrice.toFixed(2)}</p>
            `;
            orderItems.appendChild(itemElement);
        });

        // Add remove functionality
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                state.cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(state.cart));
                updateOrderSummary();
            });
        });

        // Calculate totals
        const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        // Update summary
        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        taxElement.textContent = `₱${tax.toFixed(2)}`;
        totalElement.textContent = `₱${total.toFixed(2)}`;
    }

    // Reset selections after adding to cart
    function resetSelections() {
        menuItems.forEach(item => item.classList.remove('active'));
        state.selectedDrink = null;
        state.quantity = 1;
        quantityElement.textContent = '1';
        state.addons = [];
        addonCheckboxes.forEach(checkbox => checkbox.checked = false);
    }

    // Customer name input
    const customerNameInput = document.querySelector('.customer-info input');
    customerNameInput.addEventListener('input', (e) => {
        state.customerName = e.target.value;
        localStorage.setItem('customerName', e.target.value);
    });

    // Proceed to payment
    const proceedPaymentButton = document.querySelector('.proceed-payment');
    proceedPaymentButton.addEventListener('click', () => {
        if (!state.customerName) {
            alert('Please enter customer name!');
            return;
        }
        if (state.cart.length === 0) {
            alert('Cart is empty!');
            return;
        }

        // Store current cart and customer data
        localStorage.setItem('cart', JSON.stringify(state.cart));
        localStorage.setItem('customerName', state.customerName);

        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    // Mobile responsiveness
    if (window.innerWidth <= 1200) {
        const orderSummary = document.querySelector('.order-summary');
        const cartIcon = document.querySelector('nav a:nth-child(2)');
        
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            orderSummary.classList.toggle('active');
        });
    }
}); 