// Function to parse the URL and load the championship data
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const championshipId = urlParams.get('championshipId');

    if (championshipId) {
        fetchAndDisplayChampionshipData(championshipId);
    } else {
        console.error('No championship ID provided in the URL');
        document.getElementById("errorModalLabel").textContent = 'Error';
        openModal('No championship ID provided in the URL!');
    }

    document.getElementById('searchInputRaces').addEventListener('input', filterRacesByName);
    document.getElementById('searchInputDrivers').addEventListener('input', filterDriversByName);
});

async function fetchAndDisplayChampionshipData(championshipId) {
    const { data, error } = await _supabase
        .from('championships')
        .select('*')
        .eq('id', championshipId);
    if (error) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error fetching championship data:', error.message);
        openModal("Error fetching championship data!");
        return;
    }

    const championship = data[0];
    if (championship) {
        document.title = championship.name + " | Championship Manager";
        document.getElementById('championship-name').textContent = championship.name;
        document.getElementById('start-date').textContent = championship.startDate;
        document.getElementById('end-date').textContent = championship.endDate;
        document.getElementById('description').textContent = championship.description;
    }

    const { data: raceData, error: raceError } = await _supabase
        .from('races')
        .select('*')
        .eq('championshipId', championshipId);
    if (raceError) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error fetching race data:', raceError.message);
        openModal('Error fetching race data!');
    }

    // https://www.scaler.com/topics/convert-string-to-date-javascript/
    raceData.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.').map(Number);
        const [dayB, monthB, yearB] = b.date.split('.').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB - dateA;
    });

    for (const race of raceData) {
        addRaceToTable(race);
    }

    const { data: driversData, error: driversError } = await _supabase
        .from('driversInChampionship')
        .select('driverUid')
        .eq('championshipId', championshipId);
    if (driversError) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error('Error fetching drivers data:', driversError.message);
        openModal("Error fetching drivers data!");
    }

    let driversWithPoints = [];

    for (const entry of driversData) {
        const { data: profileData, error: profileError } = await _supabase
            .from('profiles')
            .select('fullname')
            .eq('uid', entry.driverUid);
        if (profileError) {
            console.error('Error fetching driver name:', profileError.message);
            continue;
        }
        const fullname = profileData[0].fullname;

        // Fetch and calculate total points for the driver in the championship
        const { data: pointsData, error: pointsError } = await _supabase
            .from('raceResults')
            .select('points')
            .eq('driverUid', entry.driverUid)
            .in('raceId', (await getRaceIdsForChampionship(championshipId)));
        if (pointsError) {
            console.error('Error fetching driver points:', pointsError.message);
            continue;
        }

        const totalPoints = pointsData.reduce((acc, curr) => acc + curr.points, 0);

        driversWithPoints.push({
            uid: entry.driverUid,
            fullname,
            totalPoints
        });
    }

    // Sort the array in descending order based on points
    driversWithPoints.sort((a, b) => b.totalPoints - a.totalPoints);

    // Display each driver in the sorted order
    driversWithPoints.forEach(driver => {
        addDriverToTable(driver.uid, driver.fullname, driver.totalPoints);
    });

    let currentUserIsRegistered = false;
    const currentUserUid = getCookie('uid');
    // Check if currentUserUid is in entries
    currentUserIsRegistered = driversData.some(entry => entry.driverUid === currentUserUid);
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

function convertDateToComparable(dateString) {
    // Convert 'DD.MM.YYYY' to 'YYYYMMDD'
    const parts = dateString.split('.');
    return `${parts[2]}${parts[1]}${parts[0]}`;
}

function addRaceToTable(race) {
    const tbody = document.getElementById('tbody_championship_races');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `race.html?raceId=${race.id}`;
    link.textContent = race.name;
    nameCell.appendChild(link);
    const dateCell = document.createElement('td');
    dateCell.textContent = race.date;
    const locationCell = document.createElement('td');
    locationCell.textContent = race.location;

    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(locationCell);
    tbody.appendChild(row);
}

function addDriverToTable(uid, fullname, totalPoints) {
    const tbody = document.getElementById('tbody_championship_drivers');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    const link = document.createElement('a');
    link.href = `driver_profile.html?driverUid=${uid}`;
    link.textContent = fullname;
    nameCell.appendChild(link);

    const pointsCell = document.createElement('td');
    pointsCell.textContent = totalPoints;

    row.appendChild(nameCell);
    row.appendChild(pointsCell);
    tbody.appendChild(row);
}


async function getRaceIdsForChampionship(championshipId) {
    const { data: raceData, error: raceError } = await _supabase
        .from('races')
        .select('id')
        .eq('championshipId', championshipId);

    if (raceError) {
        console.error('Error fetching race IDs:', raceError.message);
        return [];
    }

    return raceData.map(race => race.id);
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
        document.getElementById("errorModalLabel").textContent = 'Success';
        console.log("Driver added to championship successfully:", data);
        openModal("You were successfully added to the championship!");
        document.getElementById('add-to-championship-button').style.display = 'none';
    } catch (err) {
        document.getElementById("errorModalLabel").textContent = 'Error';
        console.error("Error adding driver to championship:", err.message);
        openModal("Error when adding to the championship.");
    }
}

function filterRacesByName() {
    const input = document.getElementById('searchInputRaces');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('tbody_championship_races');
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

function filterDriversByName() {
    const input = document.getElementById('searchInputDrivers');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('tbody_championship_drivers');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const driverCell = rows[i].getElementsByTagName('td')[0];
        if (driverCell) {
            const driverName = driverCell.textContent || driverCell.innerText;
            if (driverName.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}