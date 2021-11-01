const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const Token = require("../dataBase/models/Token.model");
const User = require("../dataBase/models/User.model");

const router = Router();

function initRoutes() {
  router.get("/me", asyncHandler(requireToken), asyncHandler(receiveUserInfo));
  router.patch("/me", asyncHandler(requireToken), asyncHandler(updateUserInfo));
  router.post("/logout", asyncHandler(requireToken), asyncHandler(logoutUser));
}

async function receiveUserInfo(req, res, _next) {
  let user = await User.findByPk(req.userId);
  res.status(200).json(user);
}

async function updateUserInfo(req, res, _next) {
  let user = await User.update(req.headers, {
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
