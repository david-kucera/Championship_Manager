// Function to parse the URL and load the data about a driver
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const driverUid = urlParams.get('driverUid');


    if (driverUid) {
        fetchAndDisplayDriverData(driverUid);
    } else {
        console.error('No driver ID provided in the URL');
        openModal('No driver ID provided in the URL!');
    }
});

async function fetchAndDisplayDriverData(driverUid) {
    const { data: driverData, error: driverError } = await _supabase
        .from('drivers')
        .select(`
            uid,
            car,
            points,
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
