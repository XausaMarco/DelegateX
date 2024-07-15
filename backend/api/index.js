require("dotenv").config();

const app = require("../app");
const mongoose = require("mongoose");

app.get("/", (req, res) => res.send("Express on Vercel"));

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to Database"),
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
  })
  .catch(() => {
    console.log("Database connection Error");
  });

module.exports = app;
