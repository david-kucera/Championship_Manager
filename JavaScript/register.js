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

            const { user, error } = response.data;

            if (error) {
                openModal(error.message);
            } else if (user) {
                alert('Registration successful!');

                // Get user uid
                const uid = user.id;

                // Insert new profile into profiles table
                const { error: profileError } = await _supabase
                    .from('profiles')
                    .insert({ uid: uid, fullname: 'Edit your name', nationality: 'Edit your nationality' });

                if (profileError) {
                    openModal('Error creating profile. Please try again.');
                } else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            openModal('Error during registration. Please try again.');
        }
    });
});
