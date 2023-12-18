// Get UID and mail from the cookie
const uid = getCookie('uid');
const mail = getCookie('userEmail')

// Function to fill the fields of user profile
async function populateNameNationality() {
    if (isAuthenticated) {
        document.getElementById('email').value = mail || '';

        try {
            // Fetch user data from Supabase
            const { data, error } = await _supabase
                .from('profiles')
                .select('fullname, nationality, date_of_birth, description')
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('Error fetching profiles data:', error.message);
                openModal('Error fetching profiles data!');
                return;
            }

            if (data) {
                // Populate input fields with user data
                document.getElementById('fullname').value = data.fullname || '';
                document.getElementById('nationality').value = data.nationality || '';
                document.getElementById('date_of_birth').value = data.date_of_birth || '';
                document.getElementById('description').value = data.description || '';
            } else {
                openModal('User data not found in the profiles table!');
            }

        } catch (error) {
            console.error('Error fetching user data:', error.message);
            openModal('Error fetching user data!');
        }
    }
}

// Call the function to populate user data when the page loads
document.addEventListener('DOMContentLoaded', populateNameNationality);

// Function to change button when user wants to edit fields
function toggleEdit(fieldName) {
    var field = document.getElementById(fieldName);
    var editBtn = document.querySelector(`button.edit-btn[onclick="toggleEdit('${fieldName}')"]`);
    var acceptBtn = document.querySelector(`button.accept-btn[onclick="acceptChanges('${fieldName}')"]`);

    field.readOnly = !field.readOnly;
    editBtn.style.display = field.readOnly ? 'inline-block' : 'none';
    acceptBtn.style.display = field.readOnly ? 'none' : 'inline-block';
}

// Function to accept user profile changes
function acceptChanges(fieldName) {
    var field = document.getElementById(fieldName);
    var editBtn = document.querySelector(`button.edit-btn[onclick="toggleEdit('${fieldName}')"]`);
    var acceptBtn = document.querySelector(`button.accept-btn[onclick="acceptChanges('${fieldName}')"]`);

    var updatedValue = field.value;
    changeValue(updatedValue, fieldName);

    field.readOnly = true;
    editBtn.style.display = 'inline-block';
    acceptBtn.style.display = 'none';
}

// Function to change value in supabase
async function changeValue(updatedValue, fieldName) {
    if (fieldName === 'email') {
        try {
            const { data, error } = await _supabase.auth.updateUser({email: updatedValue})
            if (error) {
                console.error(`Error updating ${fieldName} in Supabase:`, error.message);
                openModal(`Error updating ${fieldName} in Supabase!`);
                return;
            }
            openModal("Please confirm the changes on both emails to see the new changes!");
            return;

        } catch (error) {
            console.error('Error updating user data in Supabase:', error.message);
            openModal('Error updating user data in Supabase!');
            return;
        }
    }
    else {
        try {
            const { data, error } = await _supabase
                .from('profiles')
                .update({ [fieldName]: updatedValue })
                .eq('uid', uid);

            if (error) {
                console.error(`Error updating ${fieldName} in Supabase:`, error.message);
                openModal('Error updating field in Supabase!');
                return;
            }
            openModal(`${fieldName} updated sucessfully in Supabase!`);
            return;

        } catch (error) {
            console.error('Error updating user data in Supabase:', error.message);
            openModal('Error updating user data in Supabase!');
            return;
        }
    }
}

async function becomeADriver() {
    const { data, error } = await _supabase
        .from('drivers')
        .insert([{ uid: uid, car: '***', points: 0 }]);

    if (error) {
        console.error('Error inserting into drivers table:', error.message);
        openModal('Error becoming a driver. Please try again.');
    } else {
        console.log('Successfully became a driver:', data);
        openModal('You are now registered as a driver!');
        setTimeout(function() {
            window.location.href = "profile.html";
        }, 1000);
    }
}