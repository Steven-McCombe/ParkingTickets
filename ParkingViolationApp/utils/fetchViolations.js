// src/utils/fetchViolations.js
const { REACT_APP_DATA_NYC_GOV_APP_TOKEN , REACT_APP_NYC_SECRET_TOKEN } = require('react-native-dotenv');

const BASE_URL = "https://data.cityofnewyork.us/resource/nc67-uf89.json";

const fetchViolationsByPlate = async (plate) => {
  console.log("ENVS", REACT_APP_DATA_NYC_GOV_APP_TOKEN, REACT_APP_NYC_SECRET_TOKEN);
  try {
    const response = await fetch(`${BASE_URL}?plate=${plate}`, {
      method: 'GET',
      headers: {
        "X-App-Token":"v6hLGk8IVIrU73i2Yla1vZiaM"
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from fetchViolationsByPlate:", data);
    return data;
  } catch (error) {
    console.error("There was an error fetching the violations data:", error);
    throw error;
  }
};

const updateViolationStatus = async (violationId, status) => {
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
    fetchViolationsByPlate,
    updateViolationStatus,
  };