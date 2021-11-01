const ToDo = require("../dataBase/models/ToDo.model");
const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");

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
  let todo = await ToDo.create(...req.headers, req.userId);
  res.status(200).json(todo);
}

async function getAllTodos(req, res, _next) {
  let todoList = await ToDo.findAll({
    where: {
      userId: req.userId,
    },
  });
  res.status(200).json({ todoList });
}

async function getTodoById(req, res, _next) {
  let todo = await ToDo.findByPk(req.params.id);

  if (!todo) throw new ErrorResponse("Todo not found", 404);
  res.status(200).json(todo);
}

async function patchTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);
  if (!todo) throw new ErrorResponse("Todo not found", 404);
  todo = await ToDo.update(req.headers, {
    where: {
      id: req.params.id,
    },
    returning: true,
  });
  res.status(200).json(todo);
}

async function deleteAllTodos(req, res, _next) {
  ToDo.destroy({
    where: {
      userId: req.userId,
    },
  });
  res.status(200).json({ message: "Deleted all todos" });
}

async function deleteTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);
  if (!todo) throw new ErrorResponse("Todo not found", 404);
  await todo.destroy();
  res.status(200).json({ message: "Deleted todo" });
}

initRoutes();

module.exports = router;
