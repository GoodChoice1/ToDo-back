const ToDo = require("../dataBase/models/ToDo.model");
const Token = require("../dataBase/models/Token.model");
const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const { nanoid } = require("nanoid");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(requireToken), asyncHandler(getAllTodos));
  router.get("/:id", asyncHandler(requireToken), asyncHandler(getTodoById));
  // router.get("/noLogin/:id/:value", asyncHandler(getTodoWithoutLogin));
  // router.get("/link/:id", asyncHandler(requireToken), asyncHandler(getLinkWithoutToken));
  router.post("/", asyncHandler(requireToken), asyncHandler(createTodo));
  router.patch("/:id", asyncHandler(requireToken), asyncHandler(patchTodoById));
  router.delete("/", asyncHandler(requireToken), asyncHandler(deleteAllTodos));
  router.delete("/:id", asyncHandler(requireToken), asyncHandler(deleteTodoById));
}

async function createTodo(req, res, _next) {
  let todo = await ToDo.create({
    title: req.body.title,
    isDone: req.body.isDone,
    isFavourite: req.body.isFavourite,
    priority: req.body.priority,
    description: req.body.description,
    userId: req.userId,
  });

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
  let todo = await ToDo.findOne({
    where: {
      userId: req.userId,
      id: req.params.id
    },
  });

  if (!todo) throw new ErrorResponse("Todo not found", 404);

  res.status(200).json(todo);
}

async function patchTodoById(req, res, _next) {
  let todo = await ToDo.findOne({
    where: {
      userId: req.userId,
      id: req.params.id
    },
  });

  if (!todo) throw new ErrorResponse("Todo not found", 404);

  todo = await ToDo.update(req.body, {
    where: {
      userId: req.userId,
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

async function deleteTodoById(req, res, _next) {
  let todo = await ToDo.findOne({
    where: {
      userId: req.userId,
      id: req.params.id
    },
  });

  if (!todo) throw new ErrorResponse("Todo not found", 404);
  await todo.destroy();

  res.status(200).json({ message: "Deleted todo" });
}

// async function getLinkWithoutToken(req, res, _next) {
//   let todo = await ToDo.findOne({
//     where: {
//       userId: req.userId,
//       id: req.params.id
//     },
//   });

//   if (!todo) throw new ErrorResponse("Todo not found", 404);

//   let token = await Token.create({
//     userId: todo.userid,
//     value: nanoid(128),
//   });

//   let value = token.value
//     .split("")
//     .map((value) => value.charCodeAt(0) ** 2 + 13)
//     .join("_");// ?????????? ?????????? ?????????????????? ????????????

//   let link = "http://localhost:3000/api/todos/noLogin/" + todo.id + "/" + value;

//   res.status(200).json({ link: link });
// }

// async function getTodoWithoutLogin(req, res, _next) {
//   let realValue = req.params.value
//     .split("_")
//     .map((value) => String.fromCharCode(Math.sqrt(value - 13)))
//     .join("");

//   let token = await Token.findOne({
//     where: {
//       value: realValue,
//     },
//   });

//   if (!token) throw new ErrorResponse("Wrong token", 403);
//   await token.destroy();

//   let todo = await ToDo.findByPk(req.params.id);

//   if (!todo) throw new ErrorResponse("Todo not found", 404);
  
//   res.status(200).json(todo);
// }

initRoutes();

module.exports = router;
