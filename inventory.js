// Constants for localStorage keys and threshold values
const INVENTORY_KEY = 'milktea_inventory';
const LOW_STOCK_THRESHOLD = 10;
const CRITICAL_STOCK_THRESHOLD = 5;

// DOM Elements
const searchInput = document.querySelector('.search-bar input');
const addItemBtn = document.querySelector('.add-item-btn');
const modal = document.getElementById('addItemModal');
const closeModalBtn = document.querySelector('.close-modal');
const addItemForm = document.getElementById('addItemForm');
const inventoryTableBody = document.querySelector('.inventory-table tbody');
const cancelBtn = document.querySelector('.cancel-btn');

// Stats Elements
const totalItemsEl = document.querySelector('.stat-card:nth-child(1) .stat-number');
const lowStockEl = document.querySelector('.stat-card:nth-child(2) .stat-number');
const criticalStockEl = document.querySelector('.stat-card:nth-child(3) .stat-number');

// Inventory State
let inventory = [];

// Initialize inventory from localStorage
function initializeInventory() {
    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    inventory = savedInventory ? JSON.parse(savedInventory) : [
        { id: '001', name: 'Classic Milk Tea', category: 'Milk Tea', quantity: 23 },
        { id: '002', name: 'Honeydew Milk Tea', category: 'Milk Tea', quantity: 12 },
        { id: '003', name: 'White Pearl', category: 'Toppings', quantity: 3 }
    ];
    saveInventory();
    updateInventoryDisplay();
    updateStats();
}

// Save inventory to localStorage
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

// Update inventory statistics
function updateStats() {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(item => item.quantity <= LOW_STOCK_THRESHOLD && item.quantity > CRITICAL_STOCK_THRESHOLD).length;
    const criticalStock = inventory.filter(item => item.quantity <= CRITICAL_STOCK_THRESHOLD).length;

    totalItemsEl.textContent = totalItems;
    lowStockEl.textContent = lowStock;
    criticalStockEl.textContent = criticalStock;
}

// Generate a unique ID for new items
function generateId() {
    const lastItem = inventory[inventory.length - 1];
    const lastId = lastItem ? parseInt(lastItem.id) : 0;
    return String(lastId + 1).padStart(3, '0');
}

// Create HTML for a single inventory row
function createInventoryRow(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>
            <button class="action-btn add" title="Add Stock" data-id="${item.id}">
                <i class="icon">⊕</i>
            </button>
            <button class="action-btn delete" title="Delete Item" data-id="${item.id}">
                <i class="icon">🗑️</i>
            </button>
        </td>
    `;

    // Add stock level indication
    if (item.quantity <= CRITICAL_STOCK_THRESHOLD) {
        row.classList.add('critical-stock');
    } else if (item.quantity <= LOW_STOCK_THRESHOLD) {
        row.classList.add('low-stock');
    }

    return row;
}

// Update the inventory table display
function updateInventoryDisplay(filterText = '') {
    inventoryTableBody.innerHTML = '';
    
    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.category.toLowerCase().includes(filterText.toLowerCase()) ||
        item.id.includes(filterText)
    );

    filteredInventory.forEach(item => {
        inventoryTableBody.appendChild(createInventoryRow(item));
    });
}

// Add new item to inventory
function addItem(name, category, quantity) {
    const newItem = {
        id: generateId(),
        name,
        category,
        quantity: parseInt(quantity)
    };

    inventory.push(newItem);
    saveInventory();
    updateInventoryDisplay();
    updateStats();
}

// Delete item from inventory
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveInventory();
        updateInventoryDisplay();
        updateStats();
    }
}

// Add stock to existing item
function addStock(id) {
    const item = inventory.find(item => item.id === id);
    if (!item) return;

    const amount = parseInt(prompt(`Enter amount to add to ${item.name}:`, '1'));
    if (isNaN(amount) || amount <= 0) return;

    item.quantity += amount;
    saveInventory();
    updateInventoryDisplay();
    updateStats();
}

// Event Listeners
addItemBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    addItemForm.reset();
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    addItemForm.reset();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        addItemForm.reset();
    }
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = document.getElementById('quantity').value;

    addItem(name, category, quantity);
    modal.style.display = 'none';
    addItemForm.reset();
});

searchInput.addEventListener('input', (e) => {
    updateInventoryDisplay(e.target.value);
});

inventoryTableBody.addEventListener('click', (e) => {
    const button = e.target.closest('.action-btn');
    if (!button) return;

    const id = button.dataset.id;
    if (button.classList.contains('delete')) {
        deleteItem(id);
    } else if (button.classList.contains('add')) {
        addStock(id);
    }
});

// Initialize the inventory when the page loads
document.addEventListener('DOMContentLoaded', initializeInventory); 