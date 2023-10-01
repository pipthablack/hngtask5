const fs = require('fs');

function saveToFile(filePath,data) {
  const jsonData = JSON.stringify(data);
  fs.writeFile(`data/${filePath}`, jsonData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Data has been written to the file.');
  });
}

module.exports = saveToFile;