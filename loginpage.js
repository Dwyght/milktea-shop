// Greet the Capybara fan once page loads
window.onload = function () {
    console.log("Page Loaded! Capybara welcomes you!");
};

// Validate login form before submission
function validateForm() {
    const username = document.loginForm.username.value.trim();
    const password = document.loginForm.password.value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return false;
    }

    return true;
}

// Optional: Toggle password visibility after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const passwordField = document.querySelector('input[name="password"]');

    if (passwordField) {
        const toggleButton = document.createElement('span');
        toggleButton.textContent = '👁️';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginLeft = '10px';
        toggleButton.title = "Show/Hide Password";

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.width = '90%';
        wrapper.style.margin = '8px auto';

        passwordField.parentNode.insertBefore(wrapper, passwordField);
        wrapper.appendChild(passwordField);
        wrapper.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
            passwordField.setAttribute("type", type);
        });
    }
});
