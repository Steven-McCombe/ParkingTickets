// ./utils/violationsService.js
import {REACT_APP_SERVER_URL} from "../src/config";

// Updated fetchViolations function to accept vehicleId
export const fetchViolations = async (vehicleId, userId) => {
  console.log("fetchViolations called with vehicleId:", vehicleId);
  try {
    const url = vehicleId
      ? `${REACT_APP_SERVER_URL}/violations/violations?vehicleId=${vehicleId}` // Add a query parameter for vehicleId
      : `${REACT_APP_SERVER_URL}/violations`; // Fallback to the original call if no vehicleId is provided

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log("Violations fetched successfully", responseData);
    return responseData;
    
  } catch (error) {
    console.error("Error fetching violations for vehicle ID " + vehicleId, error);
  }
};
  
  export const requestViolationsUpdate = async () => {
    console.log("requestViolationsUpdate called");
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/update-violations`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Error requesting violations update:", error);
    }
  };
  