const fs = require('fs');
const path = require('path');

const checkFile = (requestFile) => {
  const directoryPath = '../data';

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return false;
    }

    const fileExists = files.some((file) => file === fileNameToCheck);

    if (fileExists) {
      console.log(`File '${fileNameToCheck}' exists in the directory.`);
      return true;
    } else {
      console.log(`File '${fileNameToCheck}' does not exist in the directory.`);
      return false;
    }
  });
};

module.exports = checkFile;
