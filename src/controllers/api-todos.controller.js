const ToDo = require("../dataBase/models/ToDo.model");
const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");


const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(requireToken), asyncHandler(getAllTodos));
  router.get("/:id", asyncHandler(requireToken), asyncHandler(getTodoById));
  router.post("/", asyncHandler(requireToken), asyncHandler(createTodo));
  router.patch("/:id", asyncHandler(requireToken), asyncHandler(patchTodoById));
  router.delete("/", asyncHandler(requireToken), asyncHandler(deleteAllTodos));
  router.delete("/:id", asyncHandler(requireToken), asyncHandler(deleteTodoById));
}

async function createTodo(req, res, next) {
  const todo = await ToDo.create(req.body);
  res.status(200).json(todo);
}

async function getAllTodos(req, res, next) {
  let todoList = await ToDo.findAll();
  res.status(200).json({ todoList });
}

async function getTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);

  if (!todo) throw new ErrorResponse("Todo not found", 404);
  res.status(200).json({ message: "Your todo", todo: todo });
}

async function patchTodoById(req, res, next) {
  let id = req.params.id;
  let todo = await ToDo.findByPk(id);
  if (!todo) throw new ErrorResponse("Todo not found", 404);
  todo = await ToDo.update(req.body, {
    where: {
      id: req.params.id,
    },
    returning: true
  });
  res.status(200).json(todo);
}

async function deleteAllTodos(req, res, next) {
  await ToDo.destroy({
    truncate: true,
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
