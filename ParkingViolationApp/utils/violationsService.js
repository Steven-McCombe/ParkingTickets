// ./utils/violationsService.js
import {REACT_APP_SERVER_URL} from "../src/config";

// Updated fetchViolations function to accept vehicleId
// Updated fetchViolations function to accept vehicleId and userId
export const fetchViolations = async (vehicleId, userId) => {
  console.log("fetchViolations called with vehicleId:", vehicleId, "and userId:", userId);
  
  // Check if both vehicleId and userId are provided
  if (!vehicleId || !userId) {
    console.error("Vehicle ID and User ID are required to fetch violations.");
    throw new Error("Vehicle ID and User ID are required to fetch violations."); // Throw an error to be caught by the caller
  }

  try {
    // Construct the URL with both vehicleId and userId as query parameters
    const url = `${REACT_APP_SERVER_URL}/violations/violations?vehicleId=${vehicleId}&userId=${userId}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log("Violations fetched successfully for vehicle ID " + vehicleId + " and user ID " + userId, responseData);
    return responseData;
    
  } catch (error) {
    console.error("Error fetching violations for vehicle ID " + vehicleId + " and user ID " + userId, error);
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
  