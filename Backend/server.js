const express = require('express');
const dbConnect = require('./Database/index');
const {PORT} = require('./config/index');
const router = require('./Routes/index');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3001'],

}

const app = express();

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(cors(corsOptions));

app.use(router);

dbConnect();

app.use("/Storage", express.static("Storage"));

app.use(errorHandler);

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));


