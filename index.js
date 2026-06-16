//reads your .env file and loads all variables into process.env
require('dotenv').config();



//imports the express framework
const express = require('express');

//create application instance, app is your entire server
const app = express();


//tell Express to automatically parse incoming JSON from request bodies
app.use(express.json());

//Tell Express to serve any files in the public folder as static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//import route files created next
const todoRoutes = require('./src/routes/todoRoutes');

//any request starting with /todos should be handled by todoRoutes 
app.use('/todos', todoRoutes);


const PORT = process.env.PORT || 3000;
//start the server and tells it to listen for incoming requests on port 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});