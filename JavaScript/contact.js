// Function that sends message to the database
async function submitForm(event) {
    event.preventDefault();
    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;
    const timestamp = new Date();

    try {
        const { data, error } = await _supabase
            .from('contactFormSubmissions')
            .insert([{ userEmail, message, timestamp }]);

        if (error) {
            alert("Error sending form: ", error.message)
        } else {
            alert("Message successfully sent!");
            setTimeout(function() {
                window.location.href = "contact.html";
            }, 1000);
        }
    } catch (error) {
        alert("Error sending form: ", error.message)
    }
}

// Function to get the parameter data from the cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set email field value and make it non-editable if the user is authenticated
window.onload = function () {
    if (isAuthenticated) {
        const userEmailField = document.getElementById('userEmail');
        userEmailField.value = getCookie('userEmail');
        userEmailField.setAttribute('readonly', true);
    }
};
