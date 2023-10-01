const fs = require('fs');

const updateToFile = (filePath, data) => {
  const jsonData = JSON.stringify(data);
  fs.readFile(filePath, 'utf8', (err, existingContent) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Append the new content
    const updatedContent = existingContent + '\n' + jsonData;

    // Write the updated content back to the file
    fs.writeFile(filePath, updatedContent, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return;
      }
      console.log('Content has been appended to the file.');
    });
  });
}

module.exports = updateToFile;

