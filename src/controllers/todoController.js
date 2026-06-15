//import databse connection pool set up in db.js
const pool = require('../db');

//GET /todos - get all todos
const getAllTodos = async (req, res) => { //wait for the query to finish before moving on

    //try to run the query
    try{
        const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');

        //pg library returns the results in a rows array
        res.status(200).json(result.rows); //send the data back as JSON with a 200 status

    } catch (error) {
        //if something breaks, send back the error message with a 500 status
        res.status(500).json({ message: error.message});
    }
}

// GET /todos/:id - get one todo
const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /todos - create a todo
const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await pool.query(
            'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /todos/:id - update a todo
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const result = await pool.query(
            'UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title, description, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /todos/:id - delete a todo
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};