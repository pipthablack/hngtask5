const express = require('express');
const app = express();



const cors = require('cors');




// load config
// dotenv.config({ path: './src/config/db.js' });
// // Connect DB
// const connectDB = require('../src/config/db.js');
// connectDB();




app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



const screenRoute = require('./routes/screenRoute');
app.use('/api/screens', screenRoute);

app.get("/", (req, res) => {
    res.send("Server is running")
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});