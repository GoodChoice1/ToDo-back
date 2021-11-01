const ToDo = require("../dataBase/models/ToDo.model");
const { Router } = require("express");
const {
  asyncHandler,
  requireToken,
  notFound,
} = require("../middlewares/middlewares");
const Token = require("../dataBase/models/Token.model");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(requireToken), asyncHandler(getAllTodos));
  router.get("/:id", asyncHandler(requireToken), asyncHandler(getTodoById));
  router.post("/", asyncHandler(requireToken), asyncHandler(createTodo));
  router.patch("/:id", asyncHandler(requireToken), asyncHandler(patchTodoById));
  router.delete("/", asyncHandler(requireToken), asyncHandler(deleteAllTodos));
  router.delete("/:id", asyncHandler(requireToken), asyncHandler(deleteTodoById));
}

async function createTodo(req, res, _next) {
  let token = await Token.findOne({
    where: {
      value: req.body.token,
    },
  });
  let todo = await ToDo.create({
    title: req.body.title,
    description: req.body.description,
    userId: token.userId,
    isDone: req.body.isDone,
    isFavourite: req.body.isFavourite,
    priority: req.body.priority,
  });
  res.status(200).json(todo);
}

async function getAllTodos(req, res, _next) {
  let token = await Token.findOne({
    where: {
      value: req.body.token,
    },
  });

  let todoList = await ToDo.findAll({
    where: {
      userId: token.userId,
    },
  });
  res.status(200).json({ todoList });
}

async function getTodoById(req, res, next) {
  let todo = await ToDo.findByPk(req.params.id);

  if (!todo) throw notFound(req, res, next);
  res.status(200).json(todo);
}

async function patchTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);
  if (!todo) throw notFound(req, res, next);
  todo = await ToDo.update(req.body, {
    where: {
      id: req.params.id,
    },
    returning: true,
  });
  res.status(200).json(todo);
}

async function deleteAllTodos(req, res, _next) {
  let token = await Token.findOne({
    where: {
      value: req.body.token,
    },
  });
  let todoList = await ToDo.findAll({
    where: {
      userId: token.userId,
    },
  });
  todoList.forEach(async(todo) => {
    await todo.destroy();
  });
  res.status(200).json({ message: "Deleted all todos" });
}

async function deleteTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);
  if (!todo) throw notFound(req, res, next);
  await todo.destroy();
  res.status(200).json({ message: "Deleted todo" });
}

initRoutes();

module.exports = router;
