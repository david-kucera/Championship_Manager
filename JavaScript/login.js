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
            document.getElementById("errorModalLabel").textContent = 'Error';
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

            // Set role to user
            setUserRole(uid);

            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);
        }
    } catch (error) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error during login:', error.message);
        openModal('Error during login!');
    } finally {
        // Hide spinner and enable the login button
        loginBtn.innerHTML = 'Submit';
        loginBtn.disabled = false;
    }
}

async function setUserRole(uid) {
    try {
        const {data, error} = await _supabase
            .from('profiles')
            .select('role')
            .eq('uid', uid)
            .single();

        if (error) {
            document.getElementById("errorModalLabel").textContent = 'Error';
            console.error('Error fetching role:', error.message);
            openModal('Error fetching user role!');
            return;
        }

        if (data && data.role) {
            document.cookie = 'role=' + data.role + '; path=/';
        } else {
            document.getElementById("errorModalLabel").textContent = 'Error';
            console.error('User role not found.');
            openModal('User role not found!');
        }

    } catch (error) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error fetching user role:', error.message);
        openModal('Error fetching user role!');
    }
}
