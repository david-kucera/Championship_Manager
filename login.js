async function login(event) {

    event.preventDefault();

    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    try {
        console.log("Logging in...")
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: mail,
            password: password,
        });

        if (data) {
            // console.log('User signed in:', mail);

            // Set cookie to know if user is signed in
            document.cookie = "isAuthenticated=true; path=/";

            // Redirect to index
            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        }

        if (error) {
            console.error(error);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}