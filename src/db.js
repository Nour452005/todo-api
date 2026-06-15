const { Pool } = require('pg');
require('dotenv').config();


//create a pool and tell it how to connect to your specific PostgreSQL database
const pool = new Pool({ 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});


//make the pool available to other files
module.exports = pool; 




// A pool keeps a set of connections open and ready
//When a requesr comes in it borrows one, uses it and returns it when done
//Much faster