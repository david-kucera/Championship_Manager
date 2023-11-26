document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody-leaderboard');
    const { data, error } = await _supabase.from('drivers').select('*');

    const editButton = document.getElementById('editButton');
    const addButton = document.getElementById('addButton');
    let isEditing = false;

    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        // Sort by number of points
        data.sort((a, b) => b.points - a.points);

        data.forEach((driver, index) => {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.textContent = index + 1;
            const cell2 = document.createElement('td');
            cell2.textContent = driver.fullname;
            const cell3 = document.createElement('td');
            cell3.textContent = driver.nationality;
            const cell4 = document.createElement('td');
            cell4.textContent = driver.car;
            const cell5 = document.createElement('td');
            cell5.textContent = driver.points;

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            row.appendChild(cell5);

            if (index === 0) {
                row.classList.add('gold_leaderboard')
            }
            if (index === 1) {
                row.classList.add('silver_leaderboard')
            }
            if (index === 2) {
                row.classList.add('bronze_leaderboard')
            }

            if (isAuthenticated) {
                const removeButtonCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'btn btn-danger btn-sm';
                removeButton.onclick = function() {
                    removeRow(row.rowIndex);
                };
                removeButtonCell.appendChild(removeButton);
                row.appendChild(removeButtonCell);
            }

            tableBody.appendChild(row);
        });
    }

    if (isAuthenticated) {
        editButton.style.display = 'block';
        addButton.style.display = 'block';
    }

    editButton.addEventListener('click', function () {
        isEditing = !isEditing;
        toggleRemoveButtons(isAuthenticated, isEditing);
    });

    addButton.addEventListener('click', function () {
        addButton.disabled = true;
        setTimeout(async function() {
            await addNewRow();
            // Re-enable the "Add Row" button after adding the row
            addButton.disabled = false;
        }, 0);
    });

    toggleRemoveButtons(isAuthenticated, isEditing);

});

// Function to add a new row to the table
function addNewRow() {
    const tableBody = document.getElementById('tbody-leaderboard');
    const newRow = document.createElement('tr');

    // Create input fields
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        cell.appendChild(input);
        newRow.appendChild(cell);
    }

    const acceptButtonCell = document.createElement('td');
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.className = 'btn btn-primary btn-sm';
    acceptButton.onclick = function() {
        // Call a function to handle the accepted values and insert into the database
        handleAcceptedValues(newRow);

        resolve();
    };
    acceptButtonCell.appendChild(acceptButton);
    newRow.appendChild(acceptButtonCell);

    tableBody.appendChild(newRow);
}

// Function to handle the accepted values and insert into the database
function handleAcceptedValues(newRow) {
    // TODO: Implement logic to extract values from the input fields and insert into the database

    // Example: Extract values and log to console
    const values = Array.from(newRow.getElementsByTagName('input')).map(input => input.value);
    console.log('Accepted values:', values);
}

// Function to show remove buttons when user is editing
function toggleRemoveButtons(isAuthenticated, isEditing) {
    const removeButtons = document.querySelectorAll('.btn-danger');

    removeButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing ? 'block' : 'none';
    });
}


function enableEditing() {
    // TODO
}

function removeRow(rowIndex) {
    // TODO
}