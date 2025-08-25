const mongoose = require("mongoose");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/mealbridge", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Donations Schema
const donationSchema = new mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number
});

const Donation = mongoose.model("donations", donationSchema);

// Function to Calculate Distance Using Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in KM
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
}

// Function to Get Top 5 Closest Donations for an NGO
async function getRecommendations(ngoLatitude, ngoLongitude) {
    const donations = await Donation.find({}); // Get all donations from DB

    // Calculate distances
    const distances = donations.map(donation => ({
        name: donation.name,
        latitude: donation.latitude,
        longitude: donation.longitude,
        distance: calculateDistance(ngoLatitude, ngoLongitude, donation.latitude, donation.longitude)
    }));

    // Sort by distance and get the top 5
    const top5 = distances.sort((a, b) => a.distance - b.distance).slice(0, 5);
    
    return top5;
}

module.exports = getRecommendations;