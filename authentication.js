let isAuthenticated = document.cookie.includes("isAuthenticated=true");
if (isAuthenticated) {
    document.getElementById('login-option').style.display = 'none';
    document.getElementById('profile-option').style.display = 'block';
    document.getElementById('championships-option').style.display = 'block';
    document.getElementById('last-race-option').style.display = 'block';
    document.getElementById('logout-option').style.display = 'block';
} else {
    document.getElementById('login-option').style.display = 'block';
    document.getElementById('profile-option').style.display = 'none';
    document.getElementById('championships-option').style.display = 'none';
    document.getElementById('last-race-option').style.display = 'none';
    document.getElementById('logout-option').style.display = 'none';
}