var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

// Database

mongoose.connect('mongodb://localhost/atodos_db');

// Config

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;

var Todo = new Schema({  
    description: { type: String, required: true },  
    type: { type: String, default: 'Today' }
});

var TodoModel = mongoose.model('Todo', Todo);  

// Routes

app.get('/api', function (req, res) {
	res.send('Atodos API is running');
});


app.get('/api/todos', function (req, res){
  return TodoModel.find(function (err, todos) {
    if (!err) {
      return res.send(todos);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/todos', function (req, res){
  var theTodo;
  console.log("POST: ");
  console.log(req.body);
  theTodo = new TodoModel({
    description: req.body.description,
	type: req.body.type,
  });
  theTodo.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(theTodo);
});

app.get('/api/todos/:id', function (req, res){
  return TodoModel.findById(req.params.id, function (err, todo) {
    if (!err) {
      return res.send(todo);
    } else {
      return console.log(err);
    }
  });
});

app.put('/api/todos/:id', function (req, res){
  return TodoModel.findById(req.params.id, function (err, todo) {
    todo.description = req.body.description;
    todo.type = req.body.type;
    return todo.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(todo);
    });
  });
});

app.delete('/api/todos/:id', function (req, res){
  return TodoModel.findById(req.params.id, function (err, todo) {
    return todo.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});


// Launch server

app.listen(4242);