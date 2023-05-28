const express = require('express'); 

const { clog } = require('./middleware/clog');


const PORT = process.env.port || 3002; 

const app = express(); 

//import custom middleware, "clog"; 
app.use(clog); 

//Middleware for parsing JSON and urlencoded from data
app.use(express.json()); 
app.use(express.urlencoded({ extend: true })); 
app.use(express.static('public')); 













app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);