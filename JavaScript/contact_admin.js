document.getElementById('searchInput').addEventListener('keyup', filterMessages);

function filterMessages() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    let messageDivs = document.querySelectorAll('#messageList .message');

    messageDivs.forEach(div => {
        let email = div.querySelector('p strong').nextSibling.textContent.toLowerCase();
        if (email.includes(searchValue)) {
            div.style.display = '';
        } else {
            div.style.display = 'none';
        }
    });
}

async function getMessages() {
    const { data, error } = await _supabase
        .from('contactFormSubmissions')
        .select('*');
    if (error) {
        console.log(error.message);
        openModal("An error occured while fetching data! Try again.");
        return;
    }

    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    data.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <p><strong>Email:</strong> ${message.userEmail}</p>
            <p><strong>Time:</strong> ${new Date(message.timestamp).toLocaleString()}</p>
            <p><strong>Message:</strong> ${message.message}</p>
            <a href="mailto:${message.userEmail}" class="btn btn-primary reply-btn">Reply</a>
            <button class="btn btn-danger delete-btn" data-id="${message.id}">Delete</button>
            <hr>
        `;
        messageList.appendChild(messageElement);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            deleteMessage(this.getAttribute('data-id'));
        });
    });
}

async function deleteMessage(messageId) {
    const { error } = await _supabase
        .from('contactFormSubmissions')
        .delete()
        .match({ id: messageId });
    if (error) {
        console.log(error.message);
        openModal("Error deleting message!");
    } else {
        getMessages();
    }
}

if (isAdmin) {
    getMessages();
} else {
    $('#messages').hide();
    document.getElementById('errorModalLabel').textContent = 'Error';
    openModal("You are not an admin! Go away!");
}
