// Function to parse the URL and load the data about a driver
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverId = urlParams.get('driverId');

    console.log("ID: " , driverId);

    if (driverId) {
        fetchAndDisplayDriverData(driverId);
    } else {
        console.error('No driver ID provided in the URL');
        openModal('No driver ID provided in the URL!');
    }
});

async function fetchAndDisplayDriverData(driverId) {
    const { data: driverData, error: driverError } = await _supabase
        .from('drivers')
        .select(`
            id,
            uid,
            car,
            points,
            profiles (
                fullname,
                nationality,
                description
            )
        `)
        .eq('id', driverId)
        .single();

    console.log(driverData);
    if (driverError) {
        console.error('Error fetching drivers data:', error.message);
        openModal('Erro fetching drivers data!');
        return;
    }

    if (driverData && driverData.profiles) {
        const profileData = driverData.profiles;
        document.title = profileData.fullname + " | Championship Manager";
        document.getElementById('driver-fullname').textContent = profileData.fullname;
        document.getElementById('nationality').textContent = profileData.nationality;
        document.getElementById('date_of_birth').textContent = profileData.date_of_birth;
        document.getElementById('car').textContent = driverData.car;
        document.getElementById('points').textContent = driverData.points;
        document.getElementById('description').textContent = profileData.description;
    }
}
