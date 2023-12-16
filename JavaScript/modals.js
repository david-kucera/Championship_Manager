// Function to open the Bootstrap modal
function openModal(message, callback) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    $('#errorModal').modal('show');
}

// Function to close the Bootstrap modal
function closeModal() {
    $('#errorModal').modal('hide');
}