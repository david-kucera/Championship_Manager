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

            if (isAuthenticated) {
                // Remove button
                const removeButtonCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'btn btn-danger btn-sm';
                removeButton.onclick = function() {
                    removeRow(row.rowIndex-1);
                };
                removeButtonCell.appendChild(removeButton);
                row.appendChild(removeButtonCell);
                // Edit row button
                const editRowButtonCell = document.createElement('td');
                const editRowButton = document.createElement('button');
                editRowButton.textContent = 'Edit row';
                editRowButton.className = 'btn btn-warning btn-sm';
                editRowButton.onclick = function () {
                    editRow(row.rowIndex-1);
                };
                editRowButtonCell.appendChild(editRowButton);
                row.appendChild(editRowButtonCell);
            }

            tableBody.appendChild(row);
        });
    }

    editButton.addEventListener('click', function() {
        isEditing = !isEditing;
        toggleRemoveButtons(isAuthenticated, isEditing);
        toggleEditButtons(isAuthenticated, isEditing);
    });

    toggleRemoveButtons(isAuthenticated, isEditing);
    toggleEditButtons(isAuthenticated, isEditing);
});

// Function to show the remove buttons after clicking on edit button
function toggleRemoveButtons(isAuthenticated, isEditing) {
    const removeButtons = document.querySelectorAll('.btn-danger');
    removeButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing ? 'block' : 'none';
    });
}

// Function to show the edit buttons after clicking on edit button
function toggleEditButtons(isAuthenticated, isEditing) {
    const editButtons = document.querySelectorAll('.btn-warning');
    editButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing ? 'block' : 'none';
    });
}

// New name of championship
let newName;

// Function to edit a row from the table
function editRow(rowIndex) {
    const tableBody = document.getElementById('tbody_championships');
    const editedRow = tableBody.rows[rowIndex];

    const firstCell = editedRow.cells[0];
    const originalName = firstCell.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.value = originalName;
    firstCell.textContent = '';
    firstCell.appendChild(input);

    // Change the "Edit row" button to "Save Changes" for the specific row
    const editButton = editedRow.querySelector('.btn-warning');
    editButton.textContent = 'Save Changes';
    editButton.onclick = function () {
        newName = input.value;
        saveChanges(rowIndex, originalName);
    };
}

// Function to save changes made during row editing
function saveChanges(rowIndex, originalName) {
    const tableBody = document.getElementById('tbody_championships');
    const editedRow = tableBody.rows[rowIndex];
    const firstCell = editedRow.cells[0];

    updateValue(newName, originalName);
}

// Function to update row value
async function updateValue(newName, originalName) {
    try {
        const { data, error } = await _supabase
            .from('championships')
            .update({ name: newName })
            .eq('name', originalName);

        if (error) {
            console.error('Error during updating data:', error.message);
            alert('Error during updating data. Please try again.');
        } else {
            console.log('Data updated successfully:', data);
            disableRowEditing();

            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    } catch (error) {
        console.error('Error during updating data:', error.message);
        alert('Error during updating data. Please try again.');
    }
}

// Function to disable editing mode for the specific row
function disableRowEditing() {
    const tableBody = document.getElementById('tbody_championships');
    const inputFields = tableBody.querySelectorAll('input');
    inputFields.forEach(input => {
        const cell = input.parentElement;
        cell.textContent = input.value;
    });
    isEditing = false;
    toggleRemoveButtons(isAuthenticated, isEditing);
    toggleEditButtons(isAuthenticated, isEditing);
}

// Function to remove a row from the table
function removeRow(rowIndex) {
    const tableBody = document.getElementById('tbody_championships');
    const removedRow = tableBody.rows[rowIndex];

    const name = removedRow.cells[0].textContent;
    removeChampionship(name);
    tableBody.deleteRow(rowIndex);

    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// Function to add a new row to the table
function addNewRow() {
    const tableBody = document.getElementById('tbody_championships');
    const newRow = document.createElement('tr');

    for (let i = 0; i < 4; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';

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
        handleAcceptedValues(newRow);
    };
    acceptButtonCell.appendChild(acceptButton);
    newRow.appendChild(acceptButtonCell);
    tableBody.appendChild(newRow);
}

function handleAcceptedValues(newRow) {
    const values = Array.from(newRow.getElementsByTagName('input')).map(input => input.value);
    insertData(values);
    setTimeout(function() {
        window.location.href = "championships.html";
    }, 100);
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

async function removeChampionship(name) {
    try {
        const { data, error } = await _supabase
            .from('championships')
            .delete()
            .eq('name', name);

    } catch (error) {
        console.error('Error during deleting data:', error.message);
        alert('Error during deleting data. Please try again.');
    }
}