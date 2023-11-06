// ./utils/violationsService.js
import {REACT_APP_SERVER_URL} from "../src/config";

export const fetchViolations = async () => {
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/violations`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };
  
  export const requestViolationsUpdate = async () => {
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
  