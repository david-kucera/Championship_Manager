// Function to parse the URL and load the data about a driver
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('driverId');

    console.log("ID: " , driverId);

    if (driverId) {
        fetchAndDisplayDriverData(driverId);
    } else {
        console.error('No driver ID provided in the URL');
    }
});

async function fetchAndDisplayDriverData(driverId) {
    const { data, error } = await _supabase.from('drivers').select('*').eq('id', driverId);

    if (error) {
        console.error('Error fetching drivers data:', error.message);
        return;
    }

    const driver = data[0];
    if (driver) {
        document.title = driver.fullname + " | Championship Manager";
        document.getElementById('driver-fullname').textContent = driver.fullname;
        document.getElementById('nationality').textContent = driver.nationality;
        document.getElementById('car').textContent = driver.car;
        document.getElementById('description').textContent = driver.description;
    }
}
