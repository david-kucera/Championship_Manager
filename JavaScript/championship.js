// Function to parse the URL and load the championship data
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const championshipId = urlParams.get('championshipId');

    if (championshipId) {
        fetchAndDisplayChampionshipData(championshipId);
    } else {
        console.error('No championship ID provided in the URL');
    }

    if (isDriver) {
        document.getElementById('add-to-championship-button').style.display = 'block';
        document.getElementById('add-to-championship-button').onclick = function() {
            // TODO add to a championship
        };
    }
});

async function fetchAndDisplayChampionshipData(championshipId) {
    const { data, error } = await _supabase.from('championships').select('*').eq('id', championshipId);

    if (error) {
        console.error('Error fetching championship data:', error.message);
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
}
