document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await _supabase.auth.signUp({
                email: email,
                password: password,
            })
            if (error) {
                alert(error.message);
            } else {
                alert('Registration successful!');
                // Redirect to login page
                setTimeout(function() {
                    window.location.href = "login.html";
                }, 1000);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('Error during registration. Please try again.');
        }
    });
});