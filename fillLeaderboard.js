document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody-leaderboard');
    // Get drivers
    const { data, error } = await _supabase.from('drivers').select('*');

    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        // Sort by number of points
        data.sort((a, b) => b.points - a.points);
        // Fill rows
        data.forEach((driver, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${driver.fullname}</td>
                    <td>${driver.nationality}</td>
                    <td>${driver.car}</td>
                    <td>${driver.points}</td>
                `;
            if (index === 0) {
                row.classList.add('gold_leaderboard')
            }
            if (index === 1) {
                row.classList.add('silver_leaderboard')
            }
            if (index === 2) {
                row.classList.add('bronze_leaderboard')
            }
            tableBody.appendChild(row);
        });
    }
});