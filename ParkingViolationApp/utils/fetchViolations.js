// src/utils/fetchViolations.js
import { NYC_APP_TOKEN } from 'react-native-dotenv';

const BASE_URL = "https://data.cityofnewyork.us/resource/nc67-uf89.json";

export const fetchViolationsByPlate = async (plate) => {
  try {
    const response = await fetch(`${BASE_URL}?plate=${plate}`, {
      method: 'GET',
      headers: {
        "X-App-Token": NYC_APP_TOKEN,
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error fetching the violations data:", error);
    throw error;
  }
};

export const updateViolationStatus = async (violationId, status) => {
    const response = await fetch(`https://data.cityofnewyork.us/resource/nc67-uf89.json?violation_id=${violationId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_NYC_SECRET_TOKEN}`
      },
      body: JSON.stringify({ status })
    });
  
    // Handle response
    const data = await response.json();
    return data;
  };