if (isAuthenticated) {
    var editButton = document.getElementById("editButton");
    editButton.style.display = "block";
}

function enableEditing() {
    // TODO enable edit
    if (isEditing) {
        alert("Editing disabled!");
    } else {
        alert("Editing enabled!");
    }

}

function removeRow(rowId) {
    // TODO remove row
    alert("Row removed: " + rowId);
}