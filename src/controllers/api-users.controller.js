const { Router } = require("express");
const { asyncHandler, requireToken } = require("../middlewares/middlewares");
const Token = require("../dataBase/models/Token.model");
const User = require("../dataBase/models/User.model");
const ErrorResponse = require("../classes/error-response");
const { Op } = require("sequelize");

const router = Router();

function initRoutes() {
  router.get("/me", asyncHandler(requireToken), asyncHandler(receiveUserInfo));
  // router.patch("/reset-password", asyncHandler(requireToken), asyncHandler(resetPassword));//into auth 
  router.patch("/me", asyncHandler(requireToken), asyncHandler(updateUserInfo));
  router.patch("/me/password", asyncHandler(requireToken), asyncHandler(updateUserPassword));
  router.post("/logout", asyncHandler(requireToken), asyncHandler(logoutUser));
}

async function receiveUserInfo(req, res, _next) {
  let user = await User.findByPk(req.userId);
  res.status(200).json(user);
}

async function updateUserInfo(req, res, _next) {
  let user = await User.findByPk(req.userId);
  req.body.password = user.password;

  user = await User.update(req.body, {
    where: {
      id: req.userId,
    },
    returning: true,
  });

  res.status(200).json(user);
}

async function updateUserPassword(req, res, _next) {
  let user = await User.findByPk(req.userId);
  if (oldPassword != user.password)
    throw new ErrorResponse("Wrong password", 403);

  user = await User.update(
    { password: password },
    {
      where: {
        id: req.userId,
      },
      returning: true,
    }
  );

  res.status(200).json(user);
}

async function logoutUser(req, res, _next) {
  Token.destroy({
    where: {
      value: req.headers.token,
    },
  });
  
  res.status(200).json({ message: "Logged out" });
}

// async function resetPassword(req, res, _next) {
//   let token = await Token.findOne({
//     where: {
//       value: req.body.value,
//     },
//   });

//   if (!token) throw new ErrorResponse("Wrong token", 403);

//   let user = await User.update(
//     { password: req.body.password },
//     {
//       where: {
//         id: req.body.pass,
//       },
//       returning: true,
//     }
//   );

//   await token.destroy();

//   res.status(200).json(user);
// }

initRoutes();

module.exports = router;
