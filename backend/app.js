const express = require("express");
const routerv1 = require("./Router1.js");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        origin &&
        origin.startsWith("https://delegate-x-frontend.vercel.app/")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", routerv1);

module.exports = app;
