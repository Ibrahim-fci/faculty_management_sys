const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

// Import routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

// Import models
const Student = require("./models/Student");
const Admin = require("./models/Admin");
const Doctor = require("./models/doctor");
const Message = require("./models/Message");

// Import middleware
const fileUploader = require("./midelware/fileUploader");

// Constants for database URIs
const localdb = "mongodb://localhost:27017/collegeSys";
const newDB =
  "mongodb+srv://ibrahimismail00000:RqGnSq7yTTf2BzIS@cluster0.zqzloi0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/collegeSys";
const herokudb =
  "mongodb://heroku_grqts9xv:tfrrn4uu3p1psval57p18i6vmj@ds157682.mlab.com:57682/heroku_grqts9xv";

// Express app setup
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Database connection setup
async function connectToDatabase() {
  try {
    await mongoose.connect(newDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); // Exit the process if unable to connect to database
  }
}

// Middleware setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Socket.io setup
io.on("connection", (socket) => {
  socket.on("typing", (data) => {
    io.sockets.emit("userTyping", data);
  });

  socket.on("recording", (data) => {
    io.sockets.emit("userRecording", data);
  });
});

// Routers setup
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Start server
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Normalize port function
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// Error handler for server listen
function onError(error) {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

// Export app for testing or other uses
module.exports = app;

// Connect to database when starting the application
connectToDatabase().catch((err) =>
  console.error("Database connection error:", err.message)
);
