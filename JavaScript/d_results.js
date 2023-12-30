document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody_race_results');
    const uid = getCookie('uid');

    const { data: resultData, error: resultError } = await _supabase
        .from('raceResults')
        .select('raceId, position, time, points')
        .eq('driverUid', uid);
    if (resultError) {
        openModal("Error fetching result data! Try again.");
        console.log('Error fetching result data:', resultError.message);
    }

    let raceResults = [];
    for (let result of resultData) {
        const { data: raceData, error: raceError } = await _supabase
            .from('races')
            .select('name, date')
            .eq('id', result.raceId);

        if (raceError) {
            openModal("Error fetching race data! Try again.");
            console.log('Error fetching race data:', raceError.message);
            continue;
        }

        const race = raceData[0];
        raceResults.push({ ...result, name: race.name, date: race.date });
    }

    // https://www.scaler.com/topics/convert-string-to-date-javascript/
    raceResults.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.').map(Number);
        const [dayB, monthB, yearB] = b.date.split('.').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateB - dateA;
    });

    raceResults.forEach(({ raceId, name, position, time, points }) => {
        const row = document.createElement('tr');

        const cell1 = document.createElement('td');
        const link = document.createElement('a');
        link.href = `race.html?raceId=${raceId}`;
        link.textContent = name;
        cell1.appendChild(link);

        const cell2 = document.createElement('td');
        cell2.textContent = position;

        const cell3 = document.createElement('td');
        cell3.textContent = time;

        const cell4 = document.createElement('td');
        cell4.textContent = points;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);

        tableBody.appendChild(row);
    });

    document.getElementById('searchInputRaces').addEventListener('input', filterRacesByName);
});

function filterRacesByName() {
    const input = document.getElementById('searchInputRaces');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('tbody_race_results');
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