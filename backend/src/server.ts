const dotenv = require("dotenv");
dotenv.config();

import app from "./middleware/app-middleware";
import env from "./config/utils/validatePath";

// kena study lagi wth it work here instead of export the interface
declare module "express-session" {
  export interface SessionData {
    userId: string;
    name?: string;
    email?: string;
  }
}

declare module "express-serve-static-core" {
  export interface Request {
    userId?: string; // Add any other custom properties you need
    role?: string;
    email?: string;
  }
}

const port = env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
