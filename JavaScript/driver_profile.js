// Function to parse the URL and load the data about a driver
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverUid = urlParams.get('driverUid');

    if (driverUid) {
        fetchAndDisplayDriverData(driverUid);
        fetchAndDisplayRaceResults(driverUid);
        const filePath = `profile_pictures/${driverUid}/profile`;
        const publicURL = 'https://cbpdfyauboisozcxuohi.supabase.co/storage/v1/object/public/' + filePath;
        document.getElementById('profilePicImage').src = publicURL;
    } else {
        const uid = getCookie('uid');
        if (uid !== null) {
            fetchAndDisplayDriverData(uid);
            fetchAndDisplayRaceResults(uid);
            const filePath = `profile_pictures/${uid}/profile`;
            const publicURL = 'https://cbpdfyauboisozcxuohi.supabase.co/storage/v1/object/public/' + filePath;
            document.getElementById('profilePicImage').src = publicURL;
        } else {
            document.getElementById("errorModalLabel").textContent = 'Error';
            console.error('No driver ID provided in the URL');
            openModal('No driver ID provided in the URL!');
            return;
        }
    }

    document.getElementById('searchInputRaces').addEventListener('input', filterRacesByName);
});

async function fetchAndDisplayDriverData(driverUid) {
    const { data: driverData, error: driverError } = await _supabase
        .from('drivers')
        .select(`
            uid,
            car,
            profiles (
                fullname,
                nationality,
                date_of_birth,
                description
            )
        `)
        .eq('uid', driverUid)
        .single();
    if (driverError) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error fetching drivers data:', error.message);
        openModal('Error fetching drivers data!');
        return;
    }

    if (driverData && driverData.profiles) {
        const profileData = driverData.profiles;
        document.title = profileData.fullname + " | Championship Manager";
        document.getElementById('driver-fullname').textContent = profileData.fullname;
        document.getElementById('nationality').textContent = profileData.nationality;
        document.getElementById('date_of_birth').textContent = profileData.date_of_birth;
        document.getElementById('car').textContent = driverData.car;
        document.getElementById('description').textContent = profileData.description;
    }
}

async function fetchAndDisplayRaceResults(driverUid) {
    const { data: resultData, error: resultError } = await _supabase
        .from('raceResults')
        .select('*')
        .eq('driverUid', driverUid);
    if (resultError) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.log('Error fetching race result data: ', resultError.message);
        openModal('Error fetching race result data!');
        return;
    }

    let totalPoints = 0;

    for (const race of resultData) {
        const raceId = race.raceId;
        const position = race.position;
        const points = race.points;
        totalPoints += points

        const { data: raceData, error: raceError } = await _supabase
            .from('races')
            .select('name, date, location')
            .eq('id', raceId);
        if (raceError) {
            document.getElementById("errorModalLabel").textContent = 'Error';
            console.log('Error fetching race details: ', raceError.message);
            openModal('Error fetching race details!');
        }
        const raceName = raceData[0].name;
        const raceDate = raceData[0].date;
        const raceLocation = raceData[0].location;
        addResult(raceId, raceName, raceLocation, raceDate, position, points);
    }

    document.getElementById('points').textContent = totalPoints;
}

function addResult(raceId, raceName, raceLocation, raceDate, position, points) {
    const tbody = document.getElementById('tbody_driver_races');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `race.html?raceId=${raceId}`;
    link.textContent = raceName;
    nameCell.appendChild(link);
    const locationCell = document.createElement('td');
    locationCell.textContent = raceLocation;
    const dateCell = document.createElement('td');
    dateCell.textContent = raceDate;
    const positionCell = document.createElement('td');
    positionCell.textContent = position;
    const pointsCell = document.createElement('td');
    pointsCell.textContent = points;

    row.appendChild(nameCell);
    row.appendChild(locationCell);
    row.appendChild(dateCell);
    row.appendChild(positionCell);
    row.appendChild(pointsCell);
    tbody.appendChild(row);
}

function filterRacesByName() {
    const input = document.getElementById('searchInputRaces');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('tbody_driver_races');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const raceCell = rows[i].getElementsByTagName('td')[0];
        if (raceCell) {
            const raceName = raceCell.textContent || raceCell.innerText;
            if (raceName.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}