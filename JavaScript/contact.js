// Function that sends message to the database
async function submitForm(event) {
    event.preventDefault();

    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;

    try {
        const { data, error } = await _supabase
            .from('contactFormSubmissions')
            .insert([{ userEmail, message }]);

        if (error) {
            alert("Error sending form: ", error.message)
            console.error('Error submitting form:', error.message);
        } else {
            alert("Message successfully sent!");
            setTimeout(function() {
                window.location.href = "contact.html";
            }, 1000);
        }
    } catch (error) {
        console.error('Unexpected error during form submission:', error.message);
    }
}
