const isValidId = (id) => !isNaN(id) && parseInt(id) > 0;

const handleError = (res, error) => {
    res.status(500).json({ message: error.message });
};


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
        console.error('getAllTodos error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        handleError(res, error);
    }
};

// POST /todos - create a todo
const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        // input validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (title.length > 200) {
            return res.status(400).json({ message: 'Title cannot exceed 200 characters' });
        }

        const result = await pool.query(
            'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
            [title.trim(), description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        // input validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (title.length > 200) {
            return res.status(400).json({ message: 'Title cannot exceed 200 characters' });
        }

        if (typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Completed must be true or false' });
        }

        const result = await pool.query(
            'UPDATE todos SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title.trim(), description, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};