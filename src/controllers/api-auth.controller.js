const User = require("../dataBase/models/User.model");
const { Op } = require("sequelize");
const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const Token = require("../dataBase/models/Token.model");
const { nanoid } = require("nanoid");
const transporter = require("../nodemailer/nodemailer");

const router = Router();

function initRoutes() {
  router.post("/register", asyncHandler(registration));
  router.post("/login", asyncHandler(login));
  router.post("/resetPassword", asyncHandler(resetPassword));
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

async function resetPassword(req, res, _next) {
  let user = await User.findOne({
    where: {
      email: req.headers.email,
    },
  });

  if (!user) throw new ErrorResponse("User with this email not found", 404);

  let token = await Token.create({
    userId: user.id,
    value: nanoid(128),
  });

  let value = token.value
    .split("")
    .map((value) => value.charCodeAt(0) ** 2 + 13)
    .join("_");

  let password = req.headers.password
    .split("")
    .map((value) => value.charCodeAt(0) ** 2 + 13)
    .join("_");

  let link = "http://localhost:3000/api/user/resetPassword/" + value + "/" + password;

  await transporter.sendMail({
    from: '"Todo list" <Lol43gg@gmail.com>',
    to: req.headers.email,
    subject: "Password resetting",
    text: "Follow the link to reset your email " + link,
    html: "Follow the link to reset your email " + link,
  });
  
  res.status(200).json("Message sent");
}

initRoutes();

module.exports = router;
