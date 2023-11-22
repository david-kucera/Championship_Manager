let isAuthenticated = document.cookie.includes("isAuthenticated=true");
const loginLogoutFooter = document.getElementById('login-logout-footer');

if (isAuthenticated) {
    document.getElementById('login-option').style.display = 'none';
    document.getElementById('profile-option').style.display = 'block';
    document.getElementById('championships-option').style.display = 'block';
    document.getElementById('last-race-option').style.display = 'block';
    document.getElementById('logout-option').style.display = 'block';
    loginLogoutFooter.textContent = 'Logout';
    loginLogoutFooter.href = 'index.html';
}
else {
    document.getElementById('login-option').style.display = 'block';
    document.getElementById('profile-option').style.display = 'none';
    document.getElementById('championships-option').style.display = 'none';
    document.getElementById('last-race-option').style.display = 'none';
    document.getElementById('logout-option').style.display = 'none';
    loginLogoutFooter.textContent = 'Login';
    loginLogoutFooter.href = 'login.html';
}