// Function to get the UID from the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get UID from the cookie
const uid = getCookie('uid');

// Use the UID as needed
if (uid) {
    console.log('User ID:', uid);
    // Additional logic using the user ID...
} else {
    console.log('User ID not found in cookies.');
}


async function populateNameNationality() {
    if (isAuthenticated) {
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
                document.getElementById('name').value = data.fullname || '';
                document.getElementById('nationality').value = data.nationality || '';
            } else {
                console.log('User data not found in the profiles table.');
            }

        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
        // TODO does not work
        // populateEmail();
    }
}

// async function populateEmail() {
//     if (isAuthenticated) {
//         try {
//             // Fetch user data from Supabase
//             const { data, error } = await _supabase
//                 .from('Users')
//                 .select('email')
//                 .eq('uid', uid)
//                 .single();
//
//             if (error) {
//                 console.error('Error fetching user data:', error.message);
//                 return;
//             }
//
//             if (data) {
//                 document.getElementById('email').value = data.email || '';
//             } else {
//                 console.log('User data not found in the users table.');
//             }
//
//         } catch (error) {
//             console.error('Error fetching user data:', error.message);
//         }
//     }
// }

// Call the function to populate user data when the page loads
document.addEventListener('DOMContentLoaded', populateNameNationality);

function toggleEdit(fieldName) {
    var field = document.getElementById(fieldName);
    var editBtn = document.querySelector(`button.edit-btn[onclick="toggleEdit('${fieldName}')"]`);
    var acceptBtn = document.querySelector(`button.accept-btn[onclick="acceptChanges('${fieldName}')"]`);

    field.readOnly = !field.readOnly;
    editBtn.style.display = field.readOnly ? 'inline-block' : 'none';
    acceptBtn.style.display = field.readOnly ? 'none' : 'inline-block';
}

function acceptChanges(fieldName) {
    var field = document.getElementById(fieldName);
    var editBtn = document.querySelector(`button.edit-btn[onclick="toggleEdit('${fieldName}')"]`);
    var acceptBtn = document.querySelector(`button.accept-btn[onclick="acceptChanges('${fieldName}')"]`);

    // You can perform additional actions here, e.g., send data to the server.

    field.readOnly = true;
    editBtn.style.display = 'inline-block';
    acceptBtn.style.display = 'none';
}