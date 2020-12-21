const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
//const pgsql  =require('./connection');
dotenv.config({path: '.config/config.env'});

const app = express();

const PORT = process.env.PORT || 5000;



const auth = require('./routes/auth');
const basicinfo = require('./routes/basicinfo');
const skills = require('./routes/skills');
const profile = require('./routes/profile');
app.use(express.json());

app.use(cookieParser());

//Diverting Api request to route method rather than handling them in Index
app.use('/api/v1/auth', auth);
app.use('/api/v1/basicinfo', basicinfo);
app.use('/api/v1/skills',skills);
app.use('/api/v1/profile', profile);
app.get('/', (req ,res) => {
    res.send('<h1>Hi Welcome To Bhvye Home</h1>');
})


//Starting the server
app.listen(PORT, 
    console.log(`listening at ${PORT}`));

//If There Unhandled Promises The Sever Crashes
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});