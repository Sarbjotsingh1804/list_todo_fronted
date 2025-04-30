const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));



let todos = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { todos: todos });
});

app.post('/add', (req, res) => {
    const { task, priority } = req.body;
    if (task.trim() !== '') {
        todos.push({
            id: Date.now(),
            task: task,
            priority: priority || 'medium',
            completed: false
        });
    }
    res.redirect('/');
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;
    const todoIndex = todos.findIndex(todo => todo.id == id);
    
    if (todoIndex !== -1) {
        todos[todoIndex].task = task;
        todos[todoIndex].priority = priority;
    }
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id != id);
    res.redirect('/');
});

app.post('/toggle/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(todo => todo.id == id);
    
    if (todo) {
        todo.completed = !todo.completed;
    }
    res.redirect('/');
});

app.get('/filter/:priority', (req, res) => {
    const { priority } = req.params;
    const filteredTodos = priority === 'all' 
        ? todos 
        : todos.filter(todo => todo.priority === priority);
    
    res.render('index', { todos: filteredTodos });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});