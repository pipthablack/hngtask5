const express = require('express');
const router = express.Router();


const {
    startRecording,
    startStreamRecording,
    stopRecordingAndSaveFile,
    streamVideo,
} = require('../controllers/screenController');


// start recording
router.get('/start', startRecording);

// Stream recording data
router.post('/stream-recording/:requestID', startStreamRecording);

// stop recording and save file
router.post('/stop-recording/:sessionID', stopRecordingAndSaveFile);

// stream video
router.get('/stream-video/:sessionID', streamVideo);

module.exports = router;