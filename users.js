// Constants for localStorage keys
const USERS_KEY = 'milktea_users';

// DOM Elements
const searchInput = document.getElementById('searchUser');
const addUserBtn = document.querySelector('.add-user-btn');
const usersTableBody = document.getElementById('usersTableBody');

// Modal Elements
const addUserModal = document.getElementById('addUserModal');
const editUserModal = document.getElementById('editUserModal');
const addUserForm = document.getElementById('addUserForm');
const editUserForm = document.getElementById('editUserForm');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelBtns = document.querySelectorAll('.cancel-btn');

// Sample Data (replace with actual user data)
const sampleUsers = [
    {
        id: '001',
        name: 'John Smith',
        email: 'john.smith@gmail.com',
        role: 'Admin',
        status: 'Active'
    },
    {
        id: '002',
        name: 'Lebron James',
        email: 'lebronjames23@gmail.com',
        role: 'Cashier',
        status: 'Inactive'
    },
    {
        id: '003',
        name: 'Chris Paul',
        email: 'chris.paul3@gmail.com',
        role: 'Cashier',
        status: 'Inactive'
    }
];

// Initialize users data
let users = [];

// Initialize the page
function initializeUsers() {
    // Load users data
    const savedUsers = localStorage.getItem(USERS_KEY);
    users = savedUsers ? JSON.parse(savedUsers) : sampleUsers;
    
    // Update the display
    updateUsersTable();
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Update users table
function updateUsersTable(filterText = '') {
    usersTableBody.innerHTML = '';
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(filterText.toLowerCase()) ||
        user.email.toLowerCase().includes(filterText.toLowerCase()) ||
        user.role.toLowerCase().includes(filterText.toLowerCase())
    );
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-tag ${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" title="Edit User" data-id="${user.id}">
                        <i class="icon">📝</i>
                    </button>
                    <button class="action-btn delete" title="Delete User" data-id="${user.id}">
                        <i class="icon">🗑️</i>
                    </button>
                </div>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// Generate a unique ID for new users
function generateId() {
    const lastUser = users[users.length - 1];
    const lastId = lastUser ? parseInt(lastUser.id) : 0;
    return String(lastId + 1).padStart(3, '0');
}

// Add new user
function addUser(name, email, role, password) {
    const newUser = {
        id: generateId(),
        name,
        email,
        role,
        status: 'Active'
    };
    
    users.push(newUser);
    saveUsers();
    updateUsersTable();
}

// Edit user
function editUser(id, name, email, role, status) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;
    
    saveUsers();
    updateUsersTable();
}

// Delete user
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(user => user.id !== id);
        saveUsers();
        updateUsersTable();
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    
    if (password.length < 8) {
        strengthIndicator.textContent = 'Weak password (min. 8 characters)';
        strengthIndicator.classList.add('weak');
        return strengthIndicator;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars]
        .filter(Boolean).length;
    
    if (strength < 3) {
        strengthIndicator.textContent = 'Medium password';
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.textContent = 'Strong password';
        strengthIndicator.classList.add('strong');
    }
    
    return strengthIndicator;
}

// Event Listeners
addUserBtn.addEventListener('click', () => {
    addUserModal.style.display = 'block';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addUserModal.style.display = 'none';
        editUserModal.style.display = 'none';
        addUserForm.reset();
        editUserForm.reset();
    });
});

cancelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addUserModal.style.display = 'none';
        editUserModal.style.display = 'none';
        addUserForm.reset();
        editUserForm.reset();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === addUserModal) {
        addUserModal.style.display = 'none';
        addUserForm.reset();
    }
    if (e.target === editUserModal) {
        editUserModal.style.display = 'none';
        editUserForm.reset();
    }
});

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    addUser(name, email, role, password);
    addUserModal.style.display = 'none';
    addUserForm.reset();
});

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const role = document.getElementById('editUserRole').value;
    const status = document.getElementById('editUserStatus').value;
    
    editUser(id, name, email, role, status);
    editUserModal.style.display = 'none';
    editUserForm.reset();
});

searchInput.addEventListener('input', (e) => {
    updateUsersTable(e.target.value);
});

usersTableBody.addEventListener('click', (e) => {
    const button = e.target.closest('.action-btn');
    if (!button) return;
    
    const id = button.dataset.id;
    if (button.classList.contains('delete')) {
        deleteUser(id);
    } else if (button.classList.contains('edit')) {
        const user = users.find(u => u.id === id);
        if (!user) return;
        
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;
        
        editUserModal.style.display = 'block';
    }
});

// Password strength indicator
const userPassword = document.getElementById('userPassword');
userPassword.addEventListener('input', (e) => {
    const password = e.target.value;
    const previousIndicator = userPassword.parentElement.querySelector('.password-strength');
    if (previousIndicator) {
        previousIndicator.remove();
    }
    
    if (password) {
        const strengthIndicator = checkPasswordStrength(password);
        userPassword.parentElement.appendChild(strengthIndicator);
    }
});

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', initializeUsers); 