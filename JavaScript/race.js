// Function to parse the URL and load the championship data
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const raceId = urlParams.get('raceId');

    if (raceId) {
        fetchAndDisplayRaceData(raceId);
    } else {
        console.error('No race ID provided in the URL');
    }
});

async function fetchAndDisplayRaceData(raceId) {
    const { data, error } = await _supabase.from('races').select('*').eq('id', raceId);

    if (error) {
        console.error('Error fetching race data:', error.message);
        return;
    }

    const race = data[0];
    if (race) {
        document.title = race.name + " | Championship Manager";
        document.getElementById('race-name').textContent = race.name;
        document.getElementById('date').textContent = race.date;
        document.getElementById('location').textContent = race.location;
        document.getElementById('description').textContent = race.description;
    }

    return;


    const { data: driversData, error: driversError } = await _supabase
        .from('driversInRace')
        .select('driverUid')
        .eq('raceId', raceId);

    if (driversError) {
        console.error('Error fetching drivers data:', driversError.message);
        openModal("Error fetching drivers data!");
    }

    let currentUserIsRegistered = false;
    const currentUserUid = getCookie('uid');

    for (const driver of driversData) {
        const uid = driver.driverUid;
        // Check if user is already in this championship
        if (uid === currentUserUid) {
            currentUserIsRegistered = true;
        }
        const { data: profileData, error: profileError } = await _supabase
            .from('profiles')
            .select('fullname')
            .eq('uid', uid);

        if (profileError) {
            console.error('Error fetching driver details:', profileError.message);
            continue; // Skip this driver and continue with the next
        }

        addDriverToTable(profileData[0].fullname);
    }

    // Hide the button if he is in the championship
    if (isDriver && !currentUserIsRegistered) {
        document.getElementById('add-to-championship-button').style.display = 'block';
        document.getElementById('add-to-championship-button').onclick = function() {
            addDriverToChampionship(championshipId);
        };
    } else {
        document.getElementById('add-to-championship-button').style.display = 'none';
    }
}

function addRaceToTable(race) {
    const tbody = document.getElementById('tbody_championship_races');
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = race.name;
    const dateCell = document.createElement('td');
    dateCell.textContent = race.date;
    const locationCell = document.createElement('td');
    locationCell.textContent = race.location;
    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(locationCell);
    tbody.appendChild(row);
}

function addDriverToTable(driverName) {
    const tbody = document.getElementById('tbody_championship_drivers');
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = driverName;
    row.appendChild(nameCell);
    tbody.appendChild(row);
}

async function addDriverToChampionship(championshipId) {
    let driverUid = getCookie('uid');
    if (!driverUid) {
        console.error("No driver UID found in cookies");
        return;
    }

    try {
        const { data, error } = await _supabase.from('driversInChampionship').insert([
            { championshipId: championshipId, driverUid: driverUid }
        ]);

        if (error) throw error;

        console.log("Driver added to championship successfully:", data);
        openModal("You were successfully added to the championship!");
    } catch (err) {
        console.error("Error adding driver to championship:", err.message);
        openModal("Error when adding to the championship.");
    }
}