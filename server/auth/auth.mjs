import express from "express";
import { saveUsers } from "../db/mongodb.mjs";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../db/mongodb.mjs";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Auth router");
});

authRouter.post("/create", async (req, res) => {
  if (!req?.body?.name) {
    res.statusCode = 422;
    return res.json({
      status: "name is required",
    });
  }
  if (!req?.body?.email) {
    res.statusCode = 422;
    return res.json({
      status: "email is required",
    });
  }
  if (!req?.body?.password) {
    res.statusCode = 422;
    return res.json({
      status: "password is required",
    });
  }

  const password = req?.body?.password || "";
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("hash", hashedPassword);

  // console.log('isTrue', bcrypt.compareSync(password, `${hash}1`));

  const existUser = await findUserByEmail(req.body.email);
  if (existUser?.email) {
    res.statusCode = 403;
    return res.json({
      status: "User already exist",
    });
  }
  console.log(existUser);

  const result = await saveUsers({
    name: req?.body?.name,
    email: req?.body?.email,
    hashedPassword: hashedPassword,
    roles: ["user"],
    status: "active",
  });
  console.log(result);

  res.json({
    _id: result?.insertedId,
    email: req.body.email,

    message: "User created",
  });
});

authRouter.post("/login", async (req, res) => {
  if (!req?.body?.email) {
    res.statusCode = 422;
    return res.json({
      status: "email is required",
    });
  }
  if (!req?.body?.password) {
    res.statusCode = 422;
    return res.json({
      status: "password is required",
    });
  }
  const user = await findUserByEmail(req.body.email);
  if (!user) {
    res.statusCode = 404;
    return res.json({
      status: "User not found",
    });
  }
  console.log(user);

  const isPasswordMatch = bcrypt.compareSync(
    req.body.password,
    user.hashedPassword
  );
  if (!isPasswordMatch) {
    res.statusCode = 403;
    return res.json({
      status: "Password is incorrect",
    });
  }

  if (user.status != "active") {
    res.statusCode = 403;
    return res.json({
      status: "User is not active",
    });
  }
  const token = jwt.sign(
    {
      userId: user?._id,
      email: req.body.email,
      roles: user?.roles || [],
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "72h",
    }
  );

  res.json({
    token,
  });
});

authRouter.post("/validate", async (req, res) => {
  const authorization = req?.headers?.authorization || "";
  const jwt_token = authorization.replace("Bearer ", "");
  const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);
  if (!decoded?.email) {
    res.statusCode = 403;
    return res.json({
      status: "Invalid token",
    });
  }

  res.json({
    isValidate: true,
  });
});
