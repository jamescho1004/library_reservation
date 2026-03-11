import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { requireLogin } from "./middlewares/auth.js";
import seatsRouter from "./routes/seats.js";
import reservationsRouter from "./routes/reservations.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "library-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/seats", seatsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/", authRouter);

connectDB();

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/reserve", requireLogin, (req, res) => {
  res.render("reserve");
});

app.get("/reservation", requireLogin, (req, res) => {
  res.render("reservation", { q: req.query });
});

app.get("/confirm", requireLogin, (req, res) => {
  res.render("confirm", { q: req.query });
});

app.listen(3000, () => {
  console.log("server connected!");
});
