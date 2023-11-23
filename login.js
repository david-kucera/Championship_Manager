async function login(event) {

    event.preventDefault();

    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: mail,
            password: password,
        });

        if (error) {
            openModal(error.message);
            console.error(error);
        } else if (data) {
            // Set cookie to know if user is signed in
            document.cookie = "isAuthenticated=true; path=/";

            // Redirect to index
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
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