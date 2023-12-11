async function logout() {
    try {
        const { error } = await _supabase.auth.signOut();
        document.cookie = "isAuthenticated=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "uid=";
        document.cookie = "userEmail=";

        if (!error) {
            // Remove auth cookie
            document.cookie = "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Redirect to the index
            window.location.href = 'index.html';
        } else {
            console.error('Logout error:', error.message);
        }
    } catch (error) {
         console.error('Unexpected error during logout:', error.message);
    }
}