async function login(event) {
    event.preventDefault();
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    try {
        // Show spinner and disable the login button
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
        loginBtn.disabled = true;

        const { data, error } = await _supabase.auth.signInWithPassword({
            email: mail,
            password: password,
        });

        if (error) {
            openModal(error.message);
            console.error(error);
        }
        else if (data) {
            // Set cookie to know if user is signed in
            document.cookie = "isAuthenticated=true; path=/";

            // Set cookie to know users mail
            const email = data.user.email;
            document.cookie = 'userEmail=' + email;

            // Set cookie to know signed user id from supabase
            const uid = data.user.id;
            document.cookie = "uid=" + uid;

            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    } finally {
        // Hide spinner and enable the login button
        loginBtn.innerHTML = 'Submit';
        loginBtn.disabled = false;
    }
}

// Function to open the Bootstrap modal
function openModal(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    $('#errorModal').modal('show');
}

// Function to close the Bootstrap modal
function closeModal() {
    $('#errorModal').modal('hide');
}