// ./helpers/cleanURL.js

// Use a regular expression to replace the unwanted part of the URL with an empty string before saving it to the database.
function cleanSummonsImageUrl(url) {
    if (url.includes('&locationName=_____________________')) {
      const cleanedUrl = url.replace(/&locationName=_____________________/, '');
      return cleanedUrl;
    } else {
      return url;
    }
  }
  
  module.exports = {
    cleanSummonsImageUrl,
  };