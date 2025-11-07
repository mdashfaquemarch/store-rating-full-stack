import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from "../configs/index.js";

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (hashPassword, userPassword) => {
  return bcrypt.compareSync(userPassword, hashPassword);
};

const generateAccessToken = (data) => {
  return jwt.sign(data, Config.ACCESS_TOKEN_SECRET, {
    expiresIn: Config.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, Config.REFRESH_TOKEN_SECRET, {
    expiresIn: Config.REFRESH_TOKEN_EXPIRY,
  });
};

const Roles = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  STORE_OWNER: "STORE_OWNER",
  NORMAL_USER: "NORMAL_USER",
};

export {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  Roles
};
