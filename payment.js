document.addEventListener('DOMContentLoaded', () => {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const customerName = localStorage.getItem('customerName') || '';
    let selectedPaymentMethod = null;

    // Generate random order number if not exists
    const orderNumber = localStorage.getItem('orderNumber') || 
        `MT-${Math.floor(Math.random() * 90000000) + 10000000}`;
    localStorage.setItem('orderNumber', orderNumber);
    document.querySelector('.order-number').textContent = `Order #${orderNumber}`;

    // Populate order items
    function displayOrderItems() {
        const orderItemsContainer = document.querySelector('.order-items');
        orderItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.innerHTML = `
                <h4>${item.drink}</h4>
                <p>Size: ${item.size}</p>
                <p>Sweetness: ${item.sweetness}</p>
                <p>Ice: ${item.ice}</p>
                ${item.addons.length ? `<p>Add-ons: ${item.addons.join(', ')}</p>` : ''}
                <p>Quantity: ${item.quantity}</p>
                <p class="item-price">₱${item.totalPrice.toFixed(2)}</p>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Update totals
        updateTotals();
    }

    // Update order totals
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        document.querySelector('.subtotal span:last-child').textContent = `₱${subtotal.toFixed(2)}`;
        document.querySelector('.tax span:last-child').textContent = `₱${tax.toFixed(2)}`;
        document.querySelector('.total span:last-child').textContent = `₱${total.toFixed(2)}`;
    }

    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedPaymentMethod = option.dataset.method;
        });
    });

    // Handle cancel button
    document.querySelector('.cancel-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            localStorage.removeItem('cart');
            localStorage.removeItem('customerName');
            localStorage.removeItem('orderNumber');
            window.location.href = 'index.html';
        }
    });

    // Add order to queue
    function addToQueue() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });

        // Create new order object
        const newOrder = {
            id: orderNumber.replace('MT-', ''),
            customer: customerName || 'Walk-in',
            time: timeString,
            status: 'in-progress',
            items: cart.map(item => ({
                quantity: item.quantity,
                name: item.drink,
                size: item.size,
                addons: item.addons
            }))
        };

        // Store the new order in localStorage to be picked up by the queue page
        localStorage.setItem('newOrder', JSON.stringify(newOrder));
    }

    // Handle complete payment button
    document.querySelector('.complete-payment-btn').addEventListener('click', () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method!');
            return;
        }

        // Here you would typically process the payment based on the selected method
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0) * 1.08;
        
        switch(selectedPaymentMethod) {
            case 'cash':
                const amountTendered = prompt(`Total amount: ₱${total.toFixed(2)}\nEnter amount tendered:`);
                if (amountTendered === null) return;
                
                const tendered = parseFloat(amountTendered);
                if (isNaN(tendered) || tendered < total) {
                    alert('Invalid amount or insufficient payment!');
                    return;
                }
                
                const change = tendered - total;
                alert(`Change: ₱${change.toFixed(2)}`);
                break;
                
            case 'card':
                alert('Processing card payment...');
                // Here you would integrate with a card payment system
                break;
                
            case 'ewallet':
                alert('Processing e-wallet payment...');
                // Here you would integrate with an e-wallet system
                break;
        }

        // Add order to queue
        addToQueue();

        // After successful payment
        alert('Payment completed successfully!');
        
        // Clear storage and return to main page
        localStorage.removeItem('cart');
        localStorage.removeItem('customerName');
        localStorage.removeItem('orderNumber');
        window.location.href = 'queue.html';
    });

    // Back button functionality
    document.querySelector('.back-button').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    // Initialize page
    displayOrderItems();
}); 