document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody-leaderboard');
    const { data, error } = await _supabase.from('drivers').select('*');
    const editButton = document.getElementById('editLeaderboardButton');
    const addButton = document.getElementById('addLeaderboardButton');
    let isEditing = false;

    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        data.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            } else {
                return a.fullname.localeCompare(b.fullname);
            }
        });

        data.forEach((driver, index) => {
            const row = document.createElement('tr');

            const cell1 = document.createElement('td');
            cell1.textContent = index + 1;  // Position
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

            if (index === 0) { row.classList.add('gold_leaderboard') }
            if (index === 1) { row.classList.add('silver_leaderboard') }
            if (index === 2) { row.classList.add('bronze_leaderboard') }

            if (isAuthenticated) {
                const removeButtonCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'btn btn-danger btn-sm';
                removeButton.onclick = function() {
                    removeRow(row.rowIndex-1);
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
            addButton.disabled = false;
        }, 0);
    });
    toggleRemoveButtons(isAuthenticated, isEditing);
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
    setTimeout(function() {
        window.location.href = "leaderboard.html";
    }, 100);
}

// Function to insert data into database
async function insertData(data) {
    try {
        const { error } = await _supabase
            .from('drivers')
            .insert({ fullname: data[1], nationality: data[2], car: data[3], points: data[4]});

    } catch (error) {
        console.error('Error during inserting data:', error.message);
        alert('Error during inserting data. Please try again.');
    }
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
        alert('Error during deleting data. Please try again.');
    }
}