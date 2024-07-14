const express = require("express");
const routerv1 = require("./Router1.js");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: ["https://delegate-x-frontend.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", routerv1);

module.exports = app;
