document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody-leaderboard');
    const { data, error } = await _supabase.from('drivers').select('*');

    const editButton = document.getElementById('editButton');
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
    }

    editButton.addEventListener('click', function () {
        isEditing = !isEditing;
        toggleRemoveButtons(isAuthenticated, isEditing);
    });

    toggleRemoveButtons(isAuthenticated, isEditing);

});

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