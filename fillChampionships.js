if (isAuthenticated) {
    var editButton = document.getElementById("editButton");
    var addButton = document.getElementById("addButton")
    editButton.style.display = "block";
    addButton.style.display = "block";
}


document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody_championships');
    const { data, error } = await _supabase.from('championships').select('*');

    const editButton = document.getElementById('editButton');
    let isEditing = false;

    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        data.forEach((championship) => {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.textContent = championship.name;
            const cell2 = document.createElement('td');
            cell2.textContent = "null";
            const cell3 = document.createElement('td');
            cell3.textContent = "null";
            const cell4 = document.createElement('td');
            cell4.textContent = "null";

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);

            // Add remove button
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

    editButton.addEventListener('click', function() {
        isEditing = !isEditing;
       toggleRemoveButtons(isAuthenticated, isEditing);
    });

    toggleRemoveButtons(isAuthenticated, isEditing);
});

// Function to show the remove buttons after clicking on edit button
function toggleRemoveButtons(isAuthenticated, isEditing) {
    const removeButtons = document.querySelectorAll('.btn-danger');

    removeButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing ? 'block' : 'none';
    });
}

function removeRow(rowId) {
    // TODO remove row
    alert("Row removed: " + rowId);
}

// Function to add a new row to the table
function addNewRow() {
    const tableBody = document.getElementById('tbody_championships');
    const newRow = document.createElement('tr');

    // Create input fields
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';

        // Disable the input for the ther columns
        if (i === 1 || i === 2 || i === 3 ) {
            input.disabled = true;
        }

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
    };
    acceptButtonCell.appendChild(acceptButton);
    newRow.appendChild(acceptButtonCell);

    tableBody.appendChild(newRow);
}

function handleAcceptedValues(newRow) {
    const values = Array.from(newRow.getElementsByTagName('input')).map(input => input.value);
    // Insert values into supabase
    insertData(values);
    // Refresh page so the edit is visible
    setTimeout(function() {
        window.location.href = "championships.html";
    }, 500);
}

async function insertData(data) {
    try {
        const { error } = await _supabase
            .from('championships')
            .insert({ name: data[0]});

    } catch (error) {
        console.error('Error during inserting data:', error.message);
        alert('Error during inserting data. Please try again.');
    }
}