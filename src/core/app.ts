import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import path = require("path");
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "../routes";
import database from "./database";

const app = express();
const COOKIE_SECRET = "secret";

dotenv.config();

//morgan & helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
morgan.token("xff", (req: any, res: any) => req.headers["x-forwarded-for"]);
app.use(
  morgan(
    ':xff :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));

//route
app.use("/", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("nodeswork_boards_server")
});
// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json("ERR_NOT_FOUND");
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    message: err.message || "ERR_UNKNOWN_ERROR",
  });
});

export default app;
