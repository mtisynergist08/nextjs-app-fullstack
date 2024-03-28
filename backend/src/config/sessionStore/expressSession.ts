const dotenv = require("dotenv");
dotenv.config();

// import {sessionStore}  from "../sessionStore/sessionPrismaStore";
import env from "../utils/validatePath";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

export const sessionMiddleware = expressSession({
  secret: env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1day expired
    secure: "auto", // kalau http=false kalau https=true
  },
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 1000 * 60 * 60 * 24, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});
