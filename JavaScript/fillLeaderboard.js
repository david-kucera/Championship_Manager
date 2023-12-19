document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody-leaderboard');

    const { data, error } = await _supabase
        .from('profiles')
        .select(`
            uid,
            fullname,
            nationality,
            drivers!inner (
              id,
              car,
              points
            )
          `);
    const editButton = document.getElementById('editLeaderboardButton');
    const addButton = document.getElementById('addLeaderboardButton');
    editButton.style.display = 'none';
    addButton.style.display = 'none';
    let isEditing = false;

    if (error) {
        console.error('Error fetching data:', error.message);
        openModal('Error fetching data!');
    } else {
        data.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            } else {
                return a.fullname.localeCompare(b.fullname);
            }
        });

        data.forEach((profile, index) => {
            const driver = profile.drivers[0];
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.textContent = index + 1;  // Position
            const cell2 = document.createElement('td');
            const link = document.createElement('a');
            link.href = `driver_profile.html?driverId=${driver.id}`;
            link.textContent = profile.fullname;
            cell2.appendChild(link);
            const cell3 = document.createElement('td');
            cell3.textContent = profile.nationality;
            const cell4 = document.createElement('td');
            cell4.textContent = driver.car;
            const cell5 = document.createElement('td');
            cell5.textContent = driver.points;

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            row.appendChild(cell5);

            if (index === 0) { row.classList.add('gold_leaderboard') }
            if (index === 1) { row.classList.add('silver_leaderboard') }
            if (index === 2) { row.classList.add('bronze_leaderboard') }

            if (isAuthenticated && isAdmin) {
                // Remove buttons
                const removeButtonCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'btn btn-danger';
                removeButton.style.padding = '0.375rem 0.75rem';
                removeButton.style.fontSize = '1rem';
                removeButton.onclick = function () {
                    removeRow(row.rowIndex - 1);
                };
                removeButtonCell.appendChild(removeButton);
                row.appendChild(removeButtonCell);

                // Edit row buttons
                const editRowButtonCell = document.createElement('td');
                const editRowButton = document.createElement('button');
                editRowButton.textContent = 'Edit row';
                editRowButton.className = 'btn btn-warning';
                editRowButton.style.padding = '0.375rem 0.75rem';
                editRowButton.style.fontSize = '1rem';
                editRowButton.style.display = 'none';
                editRowButton.onclick = function () {
                    editRow(index);
                };
                editRowButtonCell.appendChild(editRowButton);
                row.appendChild(editRowButtonCell);
            }
            tableBody.appendChild(row);
        });
    }

    if (isAuthenticated && isAdmin) {
        editButton.style.display = 'block';
        addButton.style.display = 'block';
    }

    editButton.addEventListener('click', function () {
        isEditing = !isEditing;
        const isVisible = isEditing; // Change this based on your logic
        toggleEditButtons(isAuthenticated, isEditing, isVisible);
        toggleRemoveButtons(isAuthenticated, isEditing);
    });

    addButton.addEventListener('click', function () {
        addButton.disabled = true;
        setTimeout(async function() {
            await addNewRow();
            addButton.disabled = false;
        }, 0);
    });

    toggleRemoveButtons(isAuthenticated, isEditing);
    toggleEditButtons(isAuthenticated, isEditing, false);
});

// Function to add a new row to the table
function addNewRow() {
    const tableBody = document.getElementById('tbody-leaderboard');
    const newRow = document.createElement('tr');

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';

        if (i === 0) {
            input.disabled = true;
        }

        cell.appendChild(input);
        newRow.appendChild(cell);
    }

    const acceptButtonCell = document.createElement('td');
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.className = 'btn btn-primary btn-sm';
    acceptButton.onclick = function () {
        handleAcceptedValues(newRow);
    };
    acceptButtonCell.appendChild(acceptButton);
    newRow.appendChild(acceptButtonCell);
    tableBody.appendChild(newRow);
}

// Function to handle the accepted values and insert into the database
function handleAcceptedValues(newRow) {
    const values = Array.from(newRow.getElementsByTagName('input')).map(input => input.value);
    insertData(values);
}

// Function to insert data into database
async function insertData(data) {
    try {
        const { error } = await _supabase
            .from('drivers')
            .insert({ fullname: data[1], nationality: data[2], car: data[3], points: data[4]});

    } catch (error) {
        console.error('Error during inserting data:', error.message);
        openModal('Error during inserting data. Please try again.');
    }
    openModal("Sucessfully added!");
    setTimeout(function() {
        window.location.reload();
    }, 1000);
}

// Function to show remove buttons when user is editing
function toggleRemoveButtons(isAuthenticated, isEditing) {
    const removeButtons = document.querySelectorAll('.btn-danger');
    removeButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing ? 'block' : 'none';
    });
}

// Function to remove a row from the table
function removeRow(rowIndex) {
    const tableBody = document.getElementById('tbody-leaderboard');
    const removedRow = tableBody.rows[rowIndex];

    const fullname = removedRow.cells[1].textContent;
    const nationality = removedRow.cells[2].textContent;
    const car = removedRow.cells[3].textContent;
    const points = removedRow.cells[4].textContent;

    removeDriver(fullname, nationality, car, points);
    tableBody.deleteRow(rowIndex);

    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// Function that removes driver from database.
async function removeDriver(fullname, nationality, car, points) {
    try {
        const { data, error } = await _supabase
            .from('drivers')
            .delete()
            .eq('fullname', fullname)
            .eq('nationality', nationality)
            .eq('car', car)
            .eq('points', points);

    } catch (error) {
        console.error('Error during deleting data:', error.message);
        openModal('Error during deleting data. Please try again.');
    }
}

// Modify the toggleEditButtons function
function toggleEditButtons(isAuthenticated, isEditing, isVisible) {
    const editButtons = document.querySelectorAll('.btn-warning');
    editButtons.forEach(function (button) {
        button.style.display = isAuthenticated && isEditing && isVisible ? 'block' : 'none';
    });
}

// Function to edit row in table
function editRow(rowIndex) {
    const tableBody = document.getElementById('tbody-leaderboard');
    const editedRow = tableBody.rows[rowIndex];

    // Check if the row is in edit mode
    const isInEditMode = editedRow.querySelector('.btn-warning').textContent === 'Save';

    if (isInEditMode) {
        // If in edit mode, get the inputs directly
        const inputs = editedRow.querySelectorAll('input');
        const originalValues = Array.from(inputs).map(input => input.value);

        // Skip the first and last cells which should not be editable (buttons)
        for (let i = 1; i < inputs.length - 2; i++) {
            const cell = editedRow.cells[i];
            cell.textContent = inputs[i].value;
        }

        // Change the "Save Changes" button back to "Edit row"
        const editButton = editedRow.querySelector('.btn-warning');
        editButton.textContent = 'Edit row';
        editButton.onclick = function () {
            editRow(rowIndex);
        };

    } else {
        // If not in edit mode, show inputs for editing
        const cells = editedRow.cells;
        const originalValues = Array.from(cells).map(cell => cell.textContent);

        // Skip the first and last cells which should not be editable
        for (let i = 1; i < cells.length - 1; i++) {
            // Check if the cell is editable
            if (isCellEditable(cells, i)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control';
                input.value = originalValues[i];
                cells[i].textContent = '';
                cells[i].appendChild(input);
            }
        }

        // Change the "Edit row" button to "Save Changes"
        const editButton = editedRow.querySelector('.btn-warning');
        editButton.textContent = 'Save';
        editButton.onclick = function () {
            saveChanges(rowIndex, originalValues);
        };
    }
}

// Function to check if a cell should be editable
function isCellEditable(cells, index) {
    const editRowButtonCellIndex = cells.length - 2;
    return index !== 0 && index !== editRowButtonCellIndex;
}

// Function to save changes
function saveChanges(rowIndex, originalValues) {
    const tableBody = document.getElementById('tbody-leaderboard');
    const editedRow = tableBody.rows[rowIndex];
    const inputFields = editedRow.querySelectorAll('input');

    // Check if all input values exist before updating
    if (areAllInputsValid(inputFields)) {
        const newValues = Array.from(inputFields).map(input => input.value);
        updateValues(newValues, originalValues);
    } else {
        console.error('Error: One or more input fields are null.');
        openModal('Error: One or more input fields are null.');
    }
}

// Function to check if all input values are valid
function areAllInputsValid(inputFields) {
    return Array.from(inputFields).every(input => input && input.value !== undefined && input.value !== null);
}

// Function to save changes into supabase
async function updateValues(newValues, originalValues) {
    try {
        // Begin a transaction
        const { data: uidData, error: uidError } = await _supabase
            .from('profiles')
            .select('uid')
            .eq('fullname', originalValues[1])
            .single();

        if (uidError) throw uidError;

        // Use a transaction to perform both updates
        const { data: profileData, error: profileError } = await _supabase
            .from('profiles')
            .update({
                fullname: newValues[0],
                nationality: newValues[1]
            })
            .eq('uid', uidData.uid);

        if (profileError) throw profileError;

        const { data: driversData, error: driversError } = await _supabase
            .from('drivers')
            .update({
                car: newValues[2],
                points: newValues[3]
            })
            .eq('uid', uidData.uid);

        if (driversError) throw driversError;

        openModal('Data updated successfully!');
        disableRowEditing();
    } catch (error) {
        console.error('Error during updating data:', error.message);
        openModal('Error during updating data. Please try again.');
    } finally {
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
}

// Function to disable editing mode for the specific row
function disableRowEditing() {
    const tableBody = document.getElementById('tbody-leaderboard');
    const inputFields = tableBody.querySelectorAll('input');
    inputFields.forEach(input => {
        const cell = input.parentElement;
        cell.textContent = input.value;
    });
    isEditing = false;
    toggleRemoveButtons(isAuthenticated, isEditing);
    toggleEditButtons(isAuthenticated, isEditing);
}