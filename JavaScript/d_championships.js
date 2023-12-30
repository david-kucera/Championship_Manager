document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody_championships');
    const uid = getCookie('uid');

    const { data: driverData, error: driverError } = await _supabase
        .from('driversInChampionship')
        .select('championshipId')
        .eq('driverUid', uid);
    if (driverError) {
        openModal("Error fetching data! Try again.");
        console.error('Error fetching data:', driverError.message);
        return;
    }

    let championships = [];
    for (let i = 0; i < driverData.length; i++) {
        const championshipId = driverData[i].championshipId;

        const { data: championshipData, error: championshipError } = await _supabase
            .from('championships')
            .select('id, name, startDate, endDate, description')
            .eq('id', championshipId);
        if (championshipError) {
            openModal("Error fetching data! Try again!");
            console.log('Error fetching data:', championshipError.message);
            continue;
        }
        championships.push(championshipData[0]);
    }

    championships.sort((a, b) => a.name.localeCompare(b.name));
    championships.forEach(championship => {
        const row = document.createElement('tr');

        const cell1 = document.createElement('td');
        const link = document.createElement('a');
        link.href = `championship.html?championshipId=${championship.id}`;
        link.textContent = championship.name;
        cell1.appendChild(link);

        const cell2 = document.createElement('td');
        cell2.textContent = championship.startDate;

        const cell3 = document.createElement('td');
        cell3.textContent = championship.endDate;

        const cell4 = document.createElement('td');
        cell4.textContent = championship.description;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);

        tableBody.appendChild(row);
    });

    document.getElementById('searchInput').addEventListener('input', filterChampionshipsByName);
});

function filterChampionshipsByName() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('tbody_championships');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const championshipCell = rows[i].getElementsByTagName('td')[0];
        if (championshipCell) {
            const championshipName = championshipCell.textContent || championshipCell.innerText;
            if (championshipName.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}