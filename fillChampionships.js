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