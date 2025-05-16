document.addEventListener('DOMContentLoaded', () => {
    // Initialize orders from localStorage or use default data
    let orders = JSON.parse(localStorage.getItem('orders')) || {
        active: [
            {
                id: '01',
                customer: 'Walk-in',
                time: '10:45 AM',
                status: 'in-progress',
                items: [
                    {
                        quantity: 1,
                        name: 'Taro Milk Tea',
                        size: 'Large',
                        addons: ['Boba', 'Pudding']
                    },
                    {
                        quantity: 2,
                        name: 'Classic Milk Tea',
                        size: 'Medium',
                        addons: ['Grass Jelly']
                    }
                ]
            },
            {
                id: '02',
                customer: 'Walk-in',
                time: '10:45 AM',
                status: 'in-progress',
                items: [
                    {
                        quantity: 1,
                        name: 'Taro Milk Tea',
                        size: 'Large',
                        addons: ['Boba', 'Pudding']
                    },
                    {
                        quantity: 2,
                        name: 'Classic Milk Tea',
                        size: 'Medium',
                        addons: ['Grass Jelly']
                    }
                ]
            }
        ],
        completed: [
            {
                id: '001',
                customer: 'Classic Milk Tea',
                items: '3x Classic Milk Tea (M)',
                status: 'completed'
            },
            {
                id: '002',
                customer: 'Honeydew Milk Tea',
                items: 'Taro Milk Tea (M)',
                status: 'completed'
            },
            {
                id: '003',
                customer: 'White Pearl',
                items: 'Brown Sugar (S)',
                status: 'completed'
            }
        ]
    };

    // Update active orders count
    function updateActiveOrdersCount() {
        const activeCount = orders.active.length;
        document.querySelector('.active-orders h2').innerHTML = 
            `<i class="status-icon">⚠️</i> Active Orders (${activeCount})`;
    }

    // Update completed orders count
    function updateCompletedOrdersCount() {
        const completedCount = orders.completed.length;
        document.querySelector('.completed-orders h2').innerHTML = 
            `<i class="status-icon">✓</i> Completed Orders (${completedCount})`;
    }

    // Create active order card
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.classList.add('order-card');
        
        const itemsHtml = order.items.map(item => `
            <div class="order-item">
                <div class="item-details">
                    <span class="quantity">${item.quantity}x</span>
                    <span class="name">${item.name}</span>
                    <span class="size">${item.size}</span>
                </div>
                ${item.addons.length ? `<div class="add-ons">+ ${item.addons.join(', ')}</div>` : ''}
            </div>
        `).join('');

        card.innerHTML = `
            <div class="order-header">
                <h3>#${order.id}</h3>
                <span class="status ${order.status}">${order.status.replace('-', ' ')}</span>
            </div>
            <div class="order-details">
                <div class="customer-info">
                    <p>Customer: ${order.customer}</p>
                    <p>Time: ${order.time}</p>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
            </div>
            <button class="complete-order-btn" data-id="${order.id}">
                <i class="icon">✓</i> Complete Order
            </button>
        `;

        return card;
    }

    // Render active orders
    function renderActiveOrders() {
        const container = document.querySelector('.order-cards');
        container.innerHTML = '';
        
        orders.active.forEach(order => {
            container.appendChild(createOrderCard(order));
        });

        // Add event listeners to complete buttons
        document.querySelectorAll('.complete-order-btn').forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.dataset.id;
                completeOrder(orderId);
            });
        });
    }

    // Render completed orders
    function renderCompletedOrders() {
        const tbody = document.querySelector('.completed-table tbody');
        tbody.innerHTML = '';
        
        orders.completed.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.items}</td>
                <td><span class="status ${order.status}">${order.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    // Complete an order
    function completeOrder(orderId) {
        const orderIndex = orders.active.findIndex(order => order.id === orderId);
        if (orderIndex === -1) return;

        const order = orders.active[orderIndex];
        
        // Create completed order entry
        const completedOrder = {
            id: order.id,
            customer: order.customer,
            items: order.items.map(item => 
                `${item.quantity}x ${item.name} (${item.size.charAt(0)})`
            ).join(', '),
            status: 'completed'
        };

        // Remove from active orders and add to completed orders
        orders.active.splice(orderIndex, 1);
        orders.completed.unshift(completedOrder);

        // Save to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));

        // Update UI
        updateActiveOrdersCount();
        updateCompletedOrdersCount();
        renderActiveOrders();
        renderCompletedOrders();
    }

    // Add new order (can be called when a new order is placed)
    function addNewOrder(order) {
        orders.active.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        updateActiveOrdersCount();
        renderActiveOrders();
    }

    // Initialize the page
    updateActiveOrdersCount();
    updateCompletedOrdersCount();
    renderActiveOrders();
    renderCompletedOrders();

    // Listen for new orders from payment page
    window.addEventListener('storage', (e) => {
        if (e.key === 'newOrder') {
            const newOrder = JSON.parse(e.newValue);
            if (newOrder) {
                addNewOrder(newOrder);
                localStorage.removeItem('newOrder'); // Clear the new order data
            }
        }
    });
}); 