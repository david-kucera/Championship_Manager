document.addEventListener('DOMContentLoaded', async function() {
    loadResults();

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

    document.getElementById('addResultForm').addEventListener('submit', function(event) {
        event.preventDefault();
        createResult();
    });
});

document.getElementById('championshipId').addEventListener('change', function(event) {
    const selectedChampionshipId = event.target.value;
    loadRacesForChampionship(selectedChampionshipId);
    loadDriversForChampionship(selectedChampionshipId);
});

async function loadResults() {
    const { data: resultData, error: resultError } = await _supabase
        .from('raceResults')
        .select(`
            id,
            driverUid,
            raceId,
            position,
            time,
            points,
            race:raceId (name),
            profiles:driverUid (fullname)
        `);
    if (resultError) {
        openModal("Error fetching result data! Try again.");
        console.log('Error fetching result data:', raceError.message);
        return;
    }

    for (let result of resultData) {
        addResultToTable(result);
    }
}

function addResultToTable(result) {
    const tbody = document.getElementById('tbody_results');
    const row = document.createElement('tr');
    row.setAttribute('id', `result-${result.id}`);

    const nameCell = document.createElement('td');
    const raceLink = document.createElement('a');
    raceLink.href = `race.html?raceId=${result.raceId}`;
    raceLink.textContent = result.race.name;
    nameCell.appendChild(raceLink);

    const driverCell = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.href = `driver_profile.html?driverUid=${result.driverUid}`;
    nameLink.textContent = result.profiles.fullname;
    driverCell.appendChild(nameLink);

    const positionCell = document.createElement('td');
    positionCell.textContent = result.position;
    positionCell.className = 'result-position-cell';

    const timeCell = document.createElement('td');
    timeCell.textContent = result.time;
    timeCell.className = 'result-time-cell';

    const pointsCell = document.createElement('td');
    pointsCell.textContent = result.points;
    pointsCell.className = 'result-points-cell';

    row.appendChild(nameCell);
    row.appendChild(driverCell);
    row.appendChild(positionCell);
    row.appendChild(timeCell);
    row.appendChild(pointsCell);

    // Delete button
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = function() { deleteResult(result.id, row); };
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tbody.appendChild(row);
}

async function createResult() {
    const raceId = document.getElementById('raceName').value;
    const driverUid = document.getElementById('driverUid').value;
    const position = document.getElementById('position').value;
    const time = document.getElementById('time').value;
    const points = document.getElementById('points').value;

    if (!raceId || !driverUid || !position || !time || !points) {
        openModal("Please fill all the fields correctly.");
        return;
    }

    try {
        const { data, error } = await _supabase.from('raceResults').insert([
            { driverUid, raceId, position, time, points }
        ]);
        if (error) throw error;
        openModal("Result added successfully!");
        console.log(data);
    } catch (err) {
        console.error("Error adding result:", err.message);
        openModal("Error when adding result.");
    }
}

async function loadRacesForChampionship(championshipId) {
    const { data: racesData, error: racesError } = await _supabase
        .from('races')
        .select('id, name')
        .eq('championshipId', championshipId);
    if (racesError) {
        openModal("Error fetching races! Try again.");
        console.log('Error fetching races:', racesError.message);
        return;
    }

    const raceSelect = document.getElementById('raceName');
    raceSelect.innerHTML = '';

    racesData.forEach(race => {
        let option = document.createElement('option');
        option.value = race.id;
        option.text = race.name;
        raceSelect.appendChild(option);
    });
}

async function loadDriversForChampionship(championshipId) {
    const { data: driversData, error: driversError } = await _supabase
        .from('driversInChampionship')
        .select(`driverUid`)
        .eq('championshipId', championshipId);
    if (driversError) {
        openModal("Error fetching drivers! Try again.");
        console.log('Error fetching drivers:', driversError.message);
        return;
    }

    const driverSelect = document.getElementById('driverUid');
    driverSelect.innerHTML = '';

    for (const entry of driversData) {
        const { data: profileData, error: nameError } = await _supabase
            .from('profiles')
            .select('fullname')
            .eq('uid', entry.driverUid)
            .single();

        if (nameError) {
            openModal("Error fetching driver names! Try again.");
            console.log('Error fetching driver names:', nameError.message);
            continue;
        }

        if (profileData) {
            let option = document.createElement('option');
            option.value = entry.driverUid;
            option.text = profileData.fullname;
            driverSelect.appendChild(option);
        }
    }
}

async function deleteResult(resultId, rowElement) {
    try {
        const { data, error } = await _supabase.from('raceResults').delete().match({ id: resultId });

        if (error) throw error;

        console.log("Result deleted successfully:", data);
        openModal("Result deleted successfully!");

        rowElement.remove();
    } catch (err) {
        console.error("Error deleting result:", err.message);
        openModal("Error when deleting result.");
    }
}


