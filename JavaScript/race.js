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
    const { data, error } = await _supabase
        .from('races')
        .select('*')
        .eq('id', raceId);
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

    const filePath = `maps/${race.location}`;
    const publicURL = 'https://cbpdfyauboisozcxuohi.supabase.co/storage/v1/object/public/' + filePath;
    document.getElementById('mapImage').src = publicURL;

    const { data: resultData, error: resultError } = await _supabase
        .from('raceResults')
        .select('*')
        .eq('raceId', raceId);
    if (resultError) {
        console.log('Error fetching race results: ', resultError.message);
        openModal('Error fetching race results!');
    }

    resultData.sort((a, b) => a.position - b.position);

    for (const result of resultData) {
        const uid = result.driverUid;
        const points = result.points;
        const position = result.position;
        const time = result.time;

        const { data: profileData, error: profileError } = await _supabase
            .from('profiles')
            .select('fullname')
            .eq('uid', uid);
        if (profileError) {
            console.error('Error fetching profile details:', profileError.message);
            continue; // Skip this driver and continue with the next
        }
        const name = profileData[0].fullname;

        const { data: driverData, error: driverError } = await _supabase
            .from('drivers')
            .select('car')
            .eq('uid', uid);
        if (driverError) {
            console.error("Error fetching driver details: ", driverError.message);
            openModal('Error fetching driver details!');
        }
        const car = driverData[0].car;
        addResult(name, car, position, time, points, uid);
    }
}

function addResult(name, car, position, time, points, uid) {
    const tbody = document.getElementById('tbody_race_results');
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `driver_profile.html?driverUid=${uid}`;
    link.textContent = name;
    nameCell.appendChild(link);
    const carCell = document.createElement('td');
    carCell.textContent = car;
    const positionCell = document.createElement('td');
    positionCell.textContent = position;
    const timeCell = document.createElement('td');
    timeCell.textContent = time;
    const pointsCell = document.createElement('td');
    pointsCell.textContent = points;
    row.appendChild(nameCell);
    row.appendChild(carCell);
    row.appendChild(positionCell);
    row.appendChild(timeCell);
    row.appendChild(pointsCell);
    tbody.appendChild(row);
}