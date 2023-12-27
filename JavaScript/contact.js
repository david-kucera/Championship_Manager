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
            openModal("Error sendinng form!");
        } else {
            openModal("Message successfully sent!");
            document.getElementById('message').value = '';
        }
    } catch (error) {
        openModal("Error sending form!");
    }
}

// Set email field value and make it non-editable if the user is authenticated
window.onload = function () {
    if (isAuthenticated) {
        const userEmailField = document.getElementById('userEmail');
        userEmailField.value = getCookie('userEmail');
        userEmailField.setAttribute('readonly', true);
    }
};
