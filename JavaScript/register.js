document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('form');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await _supabase.auth.signUp({
                email: email,
                password: password,
            });

            console.log('Sign Up Response:', response);

            const { user, error } = response.data;

            if (error) {
                alert(error.message);
            } else if (user) {
                alert('Registration successful!');

                // Get user uid
                const uid = user.id;

                // Insert new profile into profiles table
                const { error: profileError } = await _supabase
                    .from('profiles')
                    .insert({ uid: uid, fullname: 'Edit your name', nationality: 'Edit your nationality' });

                if (profileError) {
                    console.error('Error creating profile:', profileError.message);
                    alert('Error creating profile. Please try again.');
                } else {
                    // Redirect to login page
                    setTimeout(function() {
                        window.location.href = "login.html";
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('Error during registration. Please try again.');
        }
    });
});
