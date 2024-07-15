const express = require("express");
const router1 = express.Router();
const crypto = require("crypto");

const User = require("./models/User");
const Institution = require("./models/Institution");

router1.post("/registeruser", async (req, res) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let taxcode = req.body.taxcode;
  let password = req.body.password;
  let solanaSecret = req.body.solanaSecret;

  if (!name || !surname || !email || !taxcode || !password || !solanaSecret) {
    //if some data are not present abort
    res.status(200).send({
      stored: false,
      error: "missing parameters",
    });
    return;
  }

  if (
    (await User.findOne({ taxcode: taxcode })) ||
    (await User.findOne({ email: email })) ||
    (await Institution.findOne({ email: email }))
  ) {
    //if a user with that taxcode already exists
    res.status(200).send({
      stored: false,
      error: "already exist",
    });
    return;
  }

  //if all the data are present, store the user
  let user = new User({
    name,
    surname,
    email,
    taxcode,
    password,
    solanaSecret,
  });

  user.save();
  console.log("new user correctly stored");

  res.status(200).send({
    stored: true,
  });
});

router1.post("/registerinstitution", async (req, res) => {
  let name = req.body.name;
  let vat = req.body.vat;
  let email = req.body.email;
  let password = req.body.password;

  if (!name || !vat || !email || !password) {
    //if some data are not present abort
    res.status(200).send({
      stored: false,
      error: "missing parameters",
    });
    return;
  }
  if (
    (await Institution.findOne({ vat: vat })) ||
    (await Institution.findOne({ email: email })) ||
    (await User.findOne({ email: email }))
  ) {
    //if a user with that taxcode already exists
    res.status(200).send({
      stored: false,
      error: "already exist",
    });
    return;
  }

  let institution = new Institution({
    name: name,
    email: email,
    vat: vat,
    password: password,
  });

  institution.save();
  console.log("new institution correctly stored");

  res.status(200).send({
    stored: true,
  });
});

router1.post("/authenticate", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let address = req.body.address;

  let user = await User.findOne({
    email: email,
    password: password,
    address: address,
  });
  let institution = await Institution.findOne({
    email: email,
    password: password,
    address: address,
  });

  if (user) {
    let data = {
      name: user.name,
      surname: user.surname,
      taxcode: user.taxcode,
      solanaSecret: user.solanaSecret,
    };
    res.status(200).send({ authenticated: true, account: "user", data: data });
    return;
  }
  if (institution) {
    let data = {
      name: institution.name,
      vat: institution.vat,
    };
    res
      .status(200)
      .send({ authenticated: true, account: "institution", data: data });
    return;
  }

  res.status(200).send({ authenticated: false });
});

router1.post("/addservice", async (req, res) => {
  let vat = req.body.vat;
  let service = req.body.service;

  if (!vat || !service) {
    res.status(200).send({ error: "missing parameters" });
    return;
  }

  const institution = await Institution.findOne({ vat: vat });

  if (institution) {
    institution.services.push(service);
    await institution.save();

    res.status(200).send({ stored: true });
    return;
  }
  res.status(200).send({ stored: false });
});

router1.get("/institutions", async (req, res) => {
  let institutions = await Institution.find();
  if (institutions) {
    res.status(200).send({ error: false, institutions: institutions });
    return;
  }
  res.status(200).send({ error: true });
});

router1.post("/services", async (req, res) => {
  let vat = req.body.vat;

  if (!vat) {
    res.status(200).send({ error: "missing parameters" });
    return;
  }

  let institution = await Institution.findOne({ vat: vat }).exec();
  if (institution) {
    res.status(200).send({ error: false, services: institution.services });
    return;
  }
  res.status(200).send({ error: true });
});

router1.post("/addsignature", async (req, res) => {
  let taxcode = req.body.taxcode;
  let signature = req.body.signature;

  if (!taxcode || !signature) {
    //if some data are not present abort
    res.status(200).send({
      stored: false,
      error: "missing parameters",
    });
    return;
  }

  const user = await User.findOne({ taxcode: taxcode });

  if (user) {
    user.signatures.push(signature);
    await institution.save();

    res.status(200).send({ stored: true });
    return;
  }
  res.status(200).send({ stored: false });
});

module.exports = router1;
