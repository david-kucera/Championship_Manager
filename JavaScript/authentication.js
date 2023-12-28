let isAuthenticated = document.cookie.includes("isAuthenticated=true");
let isAdmin = document.cookie.includes("role=admin");
let isDriver = document.cookie.includes("role=driver");
const loginLogoutFooter = document.getElementById('login-logout-footer');

function setLoginLogoutLink() {
    $('#admin-dropdown').hide();
    $('#driver-dropdown').hide();

    if (isAuthenticated) {
        $('#login-option').hide();

        $('#nav-dropdown').show();
        if (isDriver) {
            $('#driver-profile-option').show();
            $('#driver-dropdown').show();
        } else {
            $('#driver-profile-option').hide();
            $('#driver-dropdown').hide();
        }

        $('#logout-option').show();

        loginLogoutFooter.textContent = 'Logout';
        loginLogoutFooter.href = 'index.html';
    } else {
        $('#login-option').show();

        $('#nav-dropdown').hide();
        $('#profile-option').hide();
        $('#driver-profile-option').hide();

        $('#logout-option').hide();
        loginLogoutFooter.textContent = 'Login';
        loginLogoutFooter.href = 'login.html';
    }

    if (isAdmin) {
        $('#driver-profile-option').hide();
        $('#admin-dropdown').show();
    }
}

// For footer handling of login/logout button
function toggleLoginLogout() {
    if (isAuthenticated) {
        logout();
    } else {
        window.location.href = "login.html";
    }
}

// Initial setup
setLoginLogoutLink();
