const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const sequelize = require('./DataBase');
const ToDo = require('./ToDo');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.startDb();

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);
  next();
});

app.route('/db')

  .post(async function(req, res){

    let title = req.body.title;
    let description = req.body.description;

    let todo = ToDo.build({
      title: title,
      description: description

    });
    await todo.save();
    res.status(200).json({message: "Created todo", title: title, description: description})
  })

  .get(async function(req, res){

    let id = req.body.id;

    if (id){

      let todo = await ToDo.findByPk(id)

      if (todo) res.status(200).json({message: "Your todo", title: todo.title, description: todo.description});
      else res.status(404).json({message: "Todo not found"});
    }
    else res.status(404).json({message:"Invalid ID"});
  })

  .put(async function(req, res){

    let id = req.body.id;
    if (id){

      let todo = await ToDo.findByPk(id);
      if (todo){

        let title = req.body.title;
        let description = req.body.description;

        if (title) todo.title = title;
        if (description) todo.description = description;

        await todo.save();
        res.status(200).json({message: "Changed todo", title: todo.title, description: todo.description })
      }
      else res.status(404).json({message: "Todo not found"});
    }
    else res.status(404).json({message:"Invalid ID"});
  })

  .delete(async function(req, res){

    ToDo.destroy({
      truncate: true,
      restartIdentity: true});

    res.status(200).json({message: "Deleted all todos"})
  })

app.delete('/db/:index',async (req, res) => {

  let id = req.params.index;
  if (id){

    let todo = await ToDo.findByPk(id)
    if (todo){

      todo.destroy();
      res.status(200).json({message: "Deleted todo"})
    }
    else res.status(404).json({message: "Todo not found"});
  }
  else res.status(404).json({message:"Invalid ID"});
})

http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
})