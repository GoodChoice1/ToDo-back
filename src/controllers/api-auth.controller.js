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
  // router.post("/reset-password", asyncHandler(resetPassword));
}

async function registration(req, res, next) {
  let user = await User.findOne({
    where: {
      [Op.or]: {
        email: req.body.email,
        login: req.body.login,
      },
    },
  });

  if (user) throw new ErrorResponse("Username and email must be unique", 400);
  user = await User.create(req.body);

  res.status(200).json(user);
}

async function login(req, res, next) {
  let user = await User.findOne({
    where: {
      login: req.body.login,
      password: req.body.password,
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

// async function resetPassword(req, res, _next) {
//   let user = await User.findOne({
//     where: {
//       email: req.body.email,
//     },
//   });

//   if (!user) throw new ErrorResponse("User not found", 404);

//   let token = await Token.create({
//     userId: user.id,
//     value: nanoid(128),
//   });

//   let value = token.value
//     .split("")
//     .map((value) => value.charCodeAt(0) ** 2 + 13)
//     .join("_");
// // добавить модель 
//   let link = "http://localhost:3000/api/user/resetPassword?xyz=" + value;

//   await transporter.sendMail({
//     from: '"Todo list" <mail>',
//     to: req.headers.email,
//     subject: "Password resetting",
//     text: "Follow the link to reset your email " + link,
//     html: "Follow the link to reset your email " + link,
//   });
  
//   res.status(200).json("Message sent");
// }

initRoutes();

module.exports = router;
