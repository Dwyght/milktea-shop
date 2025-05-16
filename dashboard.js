// Constants for localStorage keys
const ORDERS_KEY = 'milktea_orders';
const INVENTORY_KEY = 'milktea_inventory';

// Initialize dashboard data
let salesData = [];
let ordersData = [];
let popularItems = [];

// Update current date
function updateCurrentDate() {
    const currentDate = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.querySelector('.current-date').textContent = currentDate.toLocaleDateString('en-US', options);
}

// Initialize sales chart
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Sample data for pie chart
    const data = {
        labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
        datasets: [{
            data: [3100, 9500, 6300, 3200],
            backgroundColor: [
                '#4CAF50',  // Green
                '#2196F3',  // Blue
                '#FFC107',  // Yellow
                '#9C27B0'   // Purple
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Sales Distribution by Time of Day',
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

// Initialize popular items chart
function initializePopularItemsChart() {
    const ctx = document.getElementById('popularItemsChart').getContext('2d');
    
    // Sample data - replace with actual data
    const data = {
        labels: ['Taro Milk Tea', 'Classic Milk Tea', 'Thai Milk Tea', 'Matcha Milk Tea'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: [
                '#4CAF50',  // Green
                '#2196F3',  // Blue
                '#FFC107',  // Yellow
                '#9C27B0'   // Purple
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Most Popular Items',
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

// Update statistics
function updateStats() {
    // Get today's data
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    
    // Calculate sales today
    const salesToday = ordersData
        .filter(order => new Date(order.datetime) >= todayStart)
        .reduce((sum, order) => sum + order.total, 0);
    
    // Calculate orders today
    const ordersToday = ordersData
        .filter(order => new Date(order.datetime) >= todayStart)
        .length;
    
    // Calculate most popular item
    const itemCounts = {};
    ordersData.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });
    
    const mostPopularItem = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)[0];
    
    // Get low stock items
    const lowStockItems = JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]')
        .filter(item => item.quantity <= 10)
        .map(item => item.name);
    
    // Update the display
    document.querySelector('.stats-grid .stat-value:nth-child(1)').textContent = 
        `₱${salesToday.toFixed(2)}`;
    document.querySelector('.stats-grid .stat-value:nth-child(2)').textContent = 
        ordersToday.toString();
    document.querySelector('.stats-grid .stat-value:nth-child(3)').textContent = 
        mostPopularItem ? mostPopularItem[0] : 'No orders';
    document.querySelector('.stats-grid .stat-value:nth-child(4)').textContent = 
        lowStockItems[0] || 'No items low';
}

// Update recent orders
function updateRecentOrders() {
    const recentOrdersBody = document.getElementById('recentOrdersBody');
    const recentOrders = ordersData
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, 5);
    
    recentOrdersBody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.datetime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}</td>
            <td>${order.customer || 'Walk-in'}</td>
            <td>${order.items.map(item => 
                `${item.quantity}× ${item.name}`).join(', ')}</td>
            <td>₱${order.total.toFixed(2)}</td>
            <td><span class="status-tag ${order.status.toLowerCase()}">${order.status}</span></td>
        </tr>
    `).join('');
}

// Load data from localStorage
function loadData() {
    ordersData = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    updateStats();
    updateRecentOrders();
}

// Real-time updates (simulated)
function startRealTimeUpdates() {
    // Update every minute
    setInterval(() => {
        loadData();
        updateCurrentDate();
    }, 60000);
}

// Initialize the dashboard
function initializeDashboard() {
    updateCurrentDate();
    loadData();
    initializeSalesChart();
    initializePopularItemsChart();
    startRealTimeUpdates();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard); 