const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const Token = require("../dataBase/models/Token.model");
const User = require("../dataBase/models/User.model");
const ErrorResponse = require("../classes/error-response");

const router = Router();

function initRoutes() {
  router.get("/me", asyncHandler(requireToken), asyncHandler(receiveUserInfo));
  router.patch("/me", asyncHandler(requireToken), asyncHandler(updateUserInfo));
  router.patch("/me/password", asyncHandler(requireToken), asyncHandler(updateUserPassword));
  router.post("/logout", asyncHandler(requireToken), asyncHandler(logoutUser));
}

async function receiveUserInfo(req, res, _next) {
  let user = await User.findByPk(req.userId);
  res.status(200).json(user);
}

async function updateUserInfo(req, res, _next) {
  let user = await User.findByPk(req.userId)
  req.headers.password = user.password
  let user = await User.update(req.headers, {
    where: {
      id: req.userId
    },
    returning: true,
  });
  res.status(200).json(user);
}

async function updateUserPassword(req, res, _next) {
  let user = await User.findByPk(req.userId)
  if(oldPassword != user.password) throw new ErrorResponse("Wrong password",403)
  let user = await User.update({password: password}, {
    where: {
      id: req.userId
    },
    returning: true,
  });
  res.status(200).json(user);
}

async function logoutUser(req, res, _next) {
  let token = await Token.findOne({
    where: {
      value: req.headers.token,
    },
  });
  await token.destroy();
  res.status(200).json({ message: "Logged out" });
}

initRoutes();

module.exports = router;
