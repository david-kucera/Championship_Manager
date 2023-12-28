document.addEventListener('DOMContentLoaded', async function() {
    loadRaces();

    const { data: championshipsData, error: championshipsError } = await _supabase
        .from('championships')
        .select('name, id');
    if (championshipsError) {
        openModal("Error fetching championships! Try again.");
        console.log('Error fetching championships:', championshipsError.message);
    }
    championshipsData.sort((a, b) => a.name.localeCompare(b.name));

    const championshipSelect = document.getElementById('championshipId');
    championshipsData.forEach(championship => {
        let option = document.createElement('option');
        option.value = championship.id;
        option.text = `${championship.name}`;
        championshipSelect.appendChild(option);
    });

    document.getElementById('createRaceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        createRace();
    });
});

async function loadRaces() {
    const { data: raceData, error: raceError } = await _supabase
        .from('races')
        .select('*');
    if (raceError) {
        openModal("Error fetching race data! Try again.");
        console.log('Error fetching race data:', raceError.message);
        return;
    }

    // https://www.scaler.com/topics/convert-string-to-date-javascript/
    raceData.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.').map(Number);
        const [dayB, monthB, yearB] = b.date.split('.').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB - dateA;
    });

    for (let race of raceData) {
        addRaceToTable(race);
    }
}

function addRaceToTable(race) {
    const tbody = document.getElementById('tbody_races');
    const row = document.createElement('tr');
    row.setAttribute('id', `race-${race.id}`);

    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `race.html?raceId=${race.id}`;
    link.textContent = race.name;
    nameCell.appendChild(link);

    const dateCell = document.createElement('td');
    dateCell.textContent = race.date;

    const locationCell = document.createElement('td');
    locationCell.textContent = race.location;

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = race.description;

    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(locationCell);
    row.appendChild(descriptionCell);

    // Edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = "btn btn-warning";
    editButton.onclick = function() { editRace(race.id); };
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = function() { deleteRace(race.id, row); };
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
}

async function createRace() {
    const raceChampionshipId = document.getElementById('championshipId').value;
    const raceName = document.getElementById('raceName').value;
    const raceDateInput = document.getElementById('raceDate').value;
    const raceDate = raceDateInput.split('-').reverse().join('.');
    const raceLocation = document.getElementById('raceLocation').value;
    const raceDescription = document.getElementById('raceDescription').value;

    const { data, error } = await _supabase
        .from('races')
        .insert([{
            championshipId: raceChampionshipId,
            name: raceName,
            date: raceDate,
            location: raceLocation,
            description: raceDescription
        }])
        .select();
    if (error) {
        openModal("Error saving data into database! Try again.");
        console.log('Error saving data into database:', error.message);
        return;
    }
    console.log(data);
    openModal("Successfully added to races!");
    if (data && data.length > 0) {
        addRaceToTable({
            id: data[0].id,
            name: raceName,
            date: raceDate,
            location: raceLocation,
            description: raceDescription
        });
    }
}

async function deleteRace(raceId, row) {
    const { error } = await _supabase
        .from('races')
        .delete()
        .match({ id: raceId });

    if (error) {
        openModal("Error deleting race! Try again.");
        console.log('Error deleting race:', error.message);
    } else {
        row.remove();
    }
}