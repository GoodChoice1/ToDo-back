const User = require("../dataBase/models/User.model");
const { Op } = require("sequelize");
const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const Token = require("../dataBase/models/Token.model");
const { nanoid } = require("nanoid");

const router = Router();

function initRoutes() {
  router.post("/register", asyncHandler(registration));
  router.post("/login", asyncHandler(login));
}

async function registration(req, res, next) {
  let user = await User.findOne({
    where: {
      [Op.or]: {
        email: req.headers.email,
        login: req.headers.login,
      },
    },
  });
  if (user) throw new ErrorResponse("Username and email must be unique", 400);
  user = await User.create(req.headers);
  res.status(200).json(user);
}

async function login(req, res, next) {
  let user = await User.findOne({
    where: {
      login: req.headers.login,
      password: req.headers.password,
    },
  });
  if (!user) throw new ErrorResponse("Wrong login or password", 400);
  let token = await Token.create({
    userId: user.id,
    value: nanoid(128),
  });
  res.status(200).json({
    accessToken: token.value,
  });
}

initRoutes();

module.exports = router;
