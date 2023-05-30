const express = require('express'); 
const path = require('path');
const { clog } = require('./Develop/middleware/clog');
const apiRoutes = require('./Develop/public/routes/api'); 



const PORT = process.env.PORT || 3004; 

const app = express(); 

//import custom middleware, "clog"; 
app.use(clog); 

//Middleware for parsing JSON and urlencoded from data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);  
app.use(express.static(path.join(__dirname, 'Develop', 'public')));

//Get route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'))
}); 

//GET route for the notes page
//its defininfg a route fot the URL path /notes, using the HTTP GET method and sends the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html')); 
}); 



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

