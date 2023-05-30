const express = require('express'); 
const path = require('path');
const { clog } = require('./middleware/clog');
const apiRoutes = require('./routes/api'); 

const PORT = process.env.PORT || 3004; 

const app = express(); 

//import custom middleware, "clog"; 
app.use(clog); 

//Middleware for parsing JSON and urlencoded from data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));



app.use('/api', apiRoutes);  


//GET route for the notes page
//its defining a route for the URL path /notes, using the HTTP GET method and sends the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html')); 
});

//Get route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
}); 


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

