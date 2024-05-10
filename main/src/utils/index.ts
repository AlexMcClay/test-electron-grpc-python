import { app } from "electron";
const path = require("path");

require("dotenv").config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, ".env")
    : path.resolve(process.cwd(), ".env"),
});

export const isProd = process.env.NODE_ENV !== "development";
