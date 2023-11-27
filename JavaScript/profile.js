// Function to get the UID from the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get UID from the cookie
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
                .select('fullname, nationality')
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('Error fetching profiles data:', error.message);
                return;
            }

            // Check if data exists before populating fields
            if (data) {
                // Populate input fields with user data
                document.getElementById('fullname').value = data.fullname || '';
                document.getElementById('nationality').value = data.nationality || '';
            } else {
                console.log('User data not found in the profiles table.');
            }

        } catch (error) {
            console.error('Error fetching user data:', error.message);
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

    // Update the supabase
    var updatedValue = field.value;
    changeValue(updatedValue, fieldName);

    field.readOnly = true;
    editBtn.style.display = 'inline-block';
    acceptBtn.style.display = 'none';
}

// Function to change value in supabase
async function changeValue(updatedValue, fieldName) {
    if (fieldName == 'email') {
        try {
            const { data, error } = await _supabase.auth.updateUser({email: updatedValue})
            if (error) {
                console.error(`Error updating ${fieldName} in Supabase:`, error.message);
                return;
            }
            console.log(`${fieldName} updated successfully in Supabase!`);
            return;

        } catch (error) {
            console.error('Error updating user data in Supabase:', error.message);
            return;
        }
    }

    try {
        const { data, error } = await _supabase
            .from('profiles')
            .update({ [fieldName]: updatedValue })
            .eq('uid', uid);

        if (error) {
            console.error(`Error updating ${fieldName} in Supabase:`, error.message);
            return;
        }
        console.log(`${fieldName} updated successfully in Supabase!`);
        return;

    } catch (error) {
        console.error('Error updating user data in Supabase:', error.message);
        return;
    }
}