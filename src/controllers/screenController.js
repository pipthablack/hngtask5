const path = require('path');
// const { saveToFile } = require('../utils/saveToFile');
const { updateToFile } = require('../utils/updateToFile');
// const { checkFile } = require('../utils/checkFile');
// const { idGenerator } = require('../utils/idGenerator.js');
const fs = require('fs');

function idGenerator () {

  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  const randomNumString = randomNum.toString();
  return randomNumString;
  
}

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
 // Using the promises version of fs
const checkFile = async (requestFile) => {
  try {
    const files = await fs.readdir('data',() => {
      console.log("file..")
    });
    const fileExists = files.some((file) => file === requestFile);

    if (fileExists) {
      console.log(`File '${requestFile}' exists in the directory.`);
    } else {
      console.log(`File '${requestFile}' does not exist in the directory.`);
    }

    return fileExists;
  } catch (err) {
    console.error('Error reading directory:', err);
    return false;
  }
};

module.exports = checkFile;


module.exports = checkFile;


const startRecording = async (req, res) => {
  try {
    const requestID = idGenerator();
    const recordingData = { requestID, data: {}, startTime: new Date() };
    saveToFile(`${requestID}.txt`, recordingData)

    res.status(200).json({ "requestID": requestID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "start recording failed" });
  }
};



const startStreamRecording = async (req, res) => {
  try {
    const { requestID } = req.params;

    const requestFile = `${requestID}.txt`

    const isFile = await checkFile(requestFile)
    console.log(isFile)

    if (isFile) {
      res.status(404).json({ error: "Request ID not found" })
    };

    const decodeVideoDataChunk = Buffer.from(req.body.data, 'base64');
    recordingData[requestID].data.push(decodeVideoDataChunk);


    if (recordingData[requestID].timeout) {
      clearTimeout(recordingData[requestID].timeout);
    }

    recordingData[requestID].timeout = setTimeout(() => {
      deleteFile(requestID);
    }, 60000);

    res.status(200).json({ success: "recording streamed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: "recording streamed" })

  }
};



const stopRecordingAndSaveFile = (req, res) => {
  try {
    const { sessionID } = req.params;

    if (!recordingData[sessionID]) {
      return res.status(404).json({ error: "Session not found." });
    }

    const videoData = Buffer.concat(recordingData[sessionID].data);
    const uniqueFilename = `${sessionID}-video.mp4`;

    const directoryPath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const videoURL = path.join(directoryPath, uniqueFilename);

    fs.writeFileSync(videoURL, videoData);

    clearTimeout(recordingData[sessionID].timeout);
    delete recordingData[sessionID];

    const streamURL = `/stream/${sessionID}`;

    setTimeout(() => {
      deleteFile(videoURL);
    }, 5 * 60 * 1000);

    res
      .status(200)
      .json({ streamURL, message: "Video saved successfully", videoURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to stop recording and save file." });
  }
};

const generateUniqueSessionID = () => {
  return Date.now().toString();
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`Deleted file: ${filePath}`);
    }
  });
};




const streamVideo = (req, res) => {
  try {
    const { sessionID } = req.params;
    const videoURL = path.join(__dirname,
      "../uploads", `${sessionID}-video.mp4`);

    if (!fs.existsSync(videoURL)) {
      res.status(404).json({ error: "Video not found" });
    };

    const stat = fs.statSync(videoURL);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoURL, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    }
    else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoURL).pipe(res);
    }

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "stream video failed" })
  }
}



module.exports = {
  startRecording,
  startStreamRecording,
  stopRecordingAndSaveFile,
  streamVideo
};