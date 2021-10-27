const ToDo = require('./ToDo');

exports.database_post = async function(req, res){

    let title = req.body.title;
    let description = req.body.description;

    let todo = ToDo.build({
      title: title,
      description: description

    });
    await todo.save();
    res.status(200).json({message: "Created todo", title: title, description: description})
}

exports.database_get = async function(req, res){

    let id = req.body.id;

    if (id){

      let todo = await ToDo.findByPk(id)

      if (todo) res.status(200).json({message: "Your todo", title: todo.title, description: todo.description});
      else res.status(404).json({message: "Todo not found"});
    }
    else res.status(404).json({message:"Invalid ID"});
}

exports.database_put  = async function(req, res){

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
}

exports.database_delete_all = async function(req, res){

ToDo.destroy({
    truncate: true,
    restartIdentity: true});

    res.status(200).json({message: "Deleted all todos"})
}

exports.database_delete_todo =async function(req, res){

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
}