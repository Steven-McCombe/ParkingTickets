// src/utils/fetchViolations.js
const { REACT_APP_DATA_NYC_GOV_APP_TOKEN , REACT_APP_NYC_SECRET_TOKEN } = require('react-native-dotenv');

const BASE_URL = "https://data.cityofnewyork.us/resource/nc67-uf89.json";


const updateViolationStatus = async (violationId, status) => {
  console.log("updateViolationStatus called with violationId:", violationId, "and status:", status);
    const response = await fetch(`https://data.cityofnewyork.us/resource/nc67-uf89.json?violation_id=${violationId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer BlaiIiAqtxImSdJEFLMmJQynlQhd-kGsU-rY"
      },
      body: JSON.stringify({ status })
    });
  
    // Handle response
    const data = await response.json();
    console.log("Response from updateViolationStatus:", data);
    return data;
  };

  module.exports = {
    // fetchViolationsByPlate,
    updateViolationStatus,
  };