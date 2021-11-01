const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const Token = require("../dataBase/models/Token.model");
const User = require("../dataBase/models/User.model");

const router = Router();

function initRoutes() {
  router.get("/:id", asyncHandler(requireToken), asyncHandler(receiveUserInfo));
  router.patch("/:id", asyncHandler(requireToken), asyncHandler(updateUserInfo));
  router.post("/logout", asyncHandler(requireToken), asyncHandler(logoutUser));
}
initRoutes();

async function receiveUserInfo(req, res, _next) {
  let user = await User.findByPk(req.params.id);
  res.status(200).json(user);
}

async function updateUserInfo(req, res, _next) {
  let user = await User.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true,
  });
  res.status(200).json(user);
}

async function logoutUser(req, res, _next) {
  let token = await Token.findOne({
    where: {
      value: req.body.token,
    },
  });
  await token.destroy();
  res.status(200).json({ message: "Logged out" });
}

module.exports = router;
