document.addEventListener('DOMContentLoaded', async function () {
    const tableBody = document.getElementById('tbody_championships');
    const { data, error } = await _supabase.from('championships').select('*');

    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        // TODO add data from other tables
        data.forEach((championship) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${championship.name}</td>
                    <td>${null}</td>
                    <td>${null}</td>
                    <td>${null}</td>
                `;
            tableBody.appendChild(row);
        });
    }
});