const express = require('express');

//create a minirouter, this router handles everything under /todos
const router = express.Router();
const todoController = require('../controllers/todoController');

// :id a variable that captures whatever number is in the URL
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
//each route points to a function in todoController


//makes this router available to index.js
module.exports = router;