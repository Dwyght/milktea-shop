// Constants for localStorage keys
const SALES_KEY = 'milktea_sales';
const PRODUCTS_KEY = 'milktea_products';
const CASHIERS_KEY = 'milktea_cashiers';

// DOM Elements
const dateFromInput = document.getElementById('dateFrom');
const dateToInput = document.getElementById('dateTo');
const productSelect = document.getElementById('product');
const cashierSelect = document.getElementById('cashier');
const salesTableBody = document.getElementById('salesTableBody');
const summaryDateRange = document.getElementById('summaryDateRange');

// Summary Elements
const totalSalesEl = document.getElementById('totalSales');
const totalOrdersEl = document.getElementById('totalOrders');
const averageOrderEl = document.getElementById('averageOrder');
const topProductEl = document.getElementById('topProduct');

// Chart instances
let salesOverviewChart;
let popularItemsChart;

// Sample Data (replace with actual data from your order system)
const sampleSales = [
    {
        id: '001',
        datetime: '2025-05-10T13:40:00',
        products: [{ name: 'Classic Milk Tea (L)', quantity: 1, price: 200.00 }],
        customer: 'John Smith',
        paymentMethod: 'Cash',
        total: 200.00
    },
    {
        id: '002',
        datetime: '2025-05-12T10:00:00',
        products: [{ name: 'Taro Milk Tea (M)', quantity: 3, price: 100.00 }],
        customer: 'John Smith',
        paymentMethod: 'Credit Card',
        total: 300.00
    },
    {
        id: '003',
        datetime: '2025-05-14T17:34:00',
        products: [{ name: 'Brown Sugar (S)', quantity: 1, price: 1.00 }],
        customer: 'John Smith',
        paymentMethod: 'Cash',
        total: 1.00
    }
];

// Initialize sales data
let salesData = [];

// Initialize the page
function initializeSalesReport() {
    // Load sales data
    const savedSales = localStorage.getItem(SALES_KEY);
    salesData = savedSales ? JSON.parse(savedSales) : sampleSales;
    
    // Set default date range (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    dateFromInput.value = formatDateForInput(sevenDaysAgo);
    dateToInput.value = formatDateForInput(today);
    
    // Initialize filters
    initializeFilters();
    
    // Initialize charts
    initializeCharts();
    
    // Update the display
    updateSalesReport();
}

// Initialize filter dropdowns
function initializeFilters() {
    // Get unique products
    const products = new Set();
    salesData.forEach(sale => {
        sale.products.forEach(product => {
            products.add(product.name);
        });
    });
    
    // Populate product dropdown
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        productSelect.appendChild(option);
    });
    
    // Get unique cashiers
    const cashiers = new Set(salesData.map(sale => sale.customer));
    
    // Populate cashier dropdown
    cashiers.forEach(cashier => {
        const option = document.createElement('option');
        option.value = cashier;
        option.textContent = cashier;
        cashierSelect.appendChild(option);
    });
}

// Initialize charts
function initializeCharts() {
    // Sales Overview Chart
    const salesCtx = document.getElementById('salesOverviewChart').getContext('2d');
    salesOverviewChart = new Chart(salesCtx, {
        type: 'pie',
        data: {
            labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    '#4CAF50',  // Green
                    '#2196F3',  // Blue
                    '#FFC107',  // Yellow
                    '#9C27B0'   // Purple
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: 'Sales Distribution by Time of Day',
                    font: { size: 14 }
                }
            }
        }
    });

    // Popular Items Chart
    const itemsCtx = document.getElementById('popularItemsChart').getContext('2d');
    popularItemsChart = new Chart(itemsCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#4CAF50',  // Green
                    '#2196F3',  // Blue
                    '#FFC107',  // Yellow
                    '#9C27B0',  // Purple
                    '#F44336'   // Red
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: 'Most Popular Items',
                    font: { size: 14 }
                }
            }
        }
    });
}

// Update charts with filtered data
function updateCharts(sales) {
    // Update Sales Overview Chart
    const timeDistribution = {
        Morning: 0,    // 6:00 - 11:59
        Afternoon: 0,  // 12:00 - 16:59
        Evening: 0,    // 17:00 - 20:59
        Night: 0       // 21:00 - 5:59
    };

    sales.forEach(sale => {
        const hour = new Date(sale.datetime).getHours();
        if (hour >= 6 && hour < 12) {
            timeDistribution.Morning += sale.total;
        } else if (hour >= 12 && hour < 17) {
            timeDistribution.Afternoon += sale.total;
        } else if (hour >= 17 && hour < 21) {
            timeDistribution.Evening += sale.total;
        } else {
            timeDistribution.Night += sale.total;
        }
    });

    salesOverviewChart.data.datasets[0].data = Object.values(timeDistribution);
    salesOverviewChart.update();

    // Update Popular Items Chart
    const itemSales = {};
    sales.forEach(sale => {
        sale.products.forEach(product => {
            if (!itemSales[product.name]) {
                itemSales[product.name] = 0;
            }
            itemSales[product.name] += product.quantity;
        });
    });

    // Sort items by quantity and get top 5
    const topItems = Object.entries(itemSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    popularItemsChart.data.labels = topItems.map(([name]) => name);
    popularItemsChart.data.datasets[0].data = topItems.map(([,qty]) => qty);
    popularItemsChart.update();
}

// Update the sales report based on filters
function updateSalesReport() {
    const dateFrom = new Date(dateFromInput.value);
    const dateTo = new Date(dateToInput.value);
    const selectedProduct = productSelect.value;
    const selectedCashier = cashierSelect.value;
    
    // Filter sales data
    const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.datetime);
        const matchesDate = saleDate >= dateFrom && saleDate <= dateTo;
        const matchesProduct = selectedProduct === 'all' || 
            sale.products.some(p => p.name === selectedProduct);
        const matchesCashier = selectedCashier === 'all' || 
            sale.customer === selectedCashier;
        
        return matchesDate && matchesProduct && matchesCashier;
    });
    
    // Update summary
    updateSalesSummary(filteredSales);
    
    // Update charts
    updateCharts(filteredSales);
    
    // Update table
    updateSalesTable(filteredSales);
    
    // Update date range display
    summaryDateRange.textContent = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
}

// Update sales summary statistics
function updateSalesSummary(sales) {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = sales.length;
    const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Calculate top product
    const productSales = {};
    sales.forEach(sale => {
        sale.products.forEach(product => {
            if (!productSales[product.name]) {
                productSales[product.name] = 0;
            }
            productSales[product.name] += product.price * product.quantity;
        });
    });
    
    const topProduct = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)[0] || ['None', 0];
    
    // Update summary display
    totalSalesEl.textContent = formatCurrency(totalSales);
    totalOrdersEl.textContent = totalOrders;
    averageOrderEl.textContent = formatCurrency(averageOrder);
    topProductEl.textContent = formatCurrency(topProduct[1]);
}

// Update sales table
function updateSalesTable(sales) {
    salesTableBody.innerHTML = '';
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        
        const products = sale.products.map(p => 
            `${p.name} (${p.quantity}x)`).join(', ');
        
        const quantity = sale.products.reduce((sum, p) => sum + p.quantity, 0);
        
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${formatDateTime(sale.datetime)}</td>
            <td>${products}</td>
            <td>${quantity}</td>
            <td>${sale.customer}</td>
            <td><span class="payment-tag ${sale.paymentMethod.toLowerCase()}">${sale.paymentMethod}</span></td>
            <td>₱${formatCurrency(sale.total)}</td>
        `;
        
        salesTableBody.appendChild(row);
    });
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

function formatDateTime(datetime) {
    const date = new Date(datetime);
    return `${formatDate(date)}\n${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })}`;
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function formatCurrency(amount) {
    return amount.toFixed(2);
}

// Event Listeners
dateFromInput.addEventListener('change', updateSalesReport);
dateToInput.addEventListener('change', updateSalesReport);
productSelect.addEventListener('change', updateSalesReport);
cashierSelect.addEventListener('change', updateSalesReport);

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', initializeSalesReport); 