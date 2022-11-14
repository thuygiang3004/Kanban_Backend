const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

// require("dotenv").config();

// const port = process.env.process || 3002;
const port = 3002;

const server = http.createServer(app);

// Connecting to the DB
mongoose.promise = global.Promise;

mongoose
  .connect("mongodb://localhost/kanban", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
