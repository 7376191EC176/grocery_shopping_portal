const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/signup", (req, res) => {
  let data = fs.readFileSync("./data/users.json", "utf8");
  data = JSON.parse(data);
  if (req.body.username in data) {
    res.status(404).send("user exist");
    res.end();
  } else {
    data[req.body.username] = req.body.password;
    data = JSON.stringify(data);
    fs.writeFile("./data/users.json", data, () => {
      res.status(200).send("user added");
      res.end();
    });
  }
});

app.post("/login", (req, res) => {
  let data = fs.readFileSync("./data/users.json", "utf8");
  data = JSON.parse(data);
  let username = req.body.username;
  if (username in data) {
    if (data[username] == req.body.password) {
      res.status(200).send("login success");
      res.end();
    } else {
      res.status(404).send("invalid login");
      res.end();
    }
  } else {
    res.status(404).send("invalid login");
    res.end();
  }
});

app.post("/update-cart", (req, res) => {
  let data = fs.readFileSync("./data/cart.json", "utf8");
  data = JSON.parse(data);
  let username = req.body.username;
  let key = req.body.key;
  let details = req.body.details;
  if (username in data) {
    if (key in data[username]) {
      data[username][key].quantity =
        parseInt(data[username][key].quantity) + parseInt(details.quantity);
    } else {
      data[username][key] = details;
    }
  } else {
    data[username] = {
      [key]: details,
    };
  }
  if (parseInt(data[username][key].quantity) <= parseInt(details.stock)) {
    data = JSON.stringify(data);
    fs.writeFile("./data/cart.json", data, () => {
      res.status(200).send("successfully added To Cart");
      res.end();
    });
  } else {
    res.status(404).send("Insufficient availability");
    res.end();
  }
});

app.get("/product-list", (req, res) => {
  let data = fs.readFileSync("./data/warehouse_stock.json", "utf8");
  data = JSON.parse(data);
  res.json(data);
  res.end();
});

app.get("/selected-productlist", (req, res) => {
  let data = fs.readFileSync("./data/cart.json", "utf8");
  data = JSON.parse(data);
  res.json(data[req.query.user]);
  res.end();
});

app.post("/edit-cart", (req, res) => {
  let data = fs.readFileSync("./data/cart.json", "utf8");
  data = JSON.parse(data);
  let username = req.body.username;
  let details = req.body.details;
  data[username] = details;
  data = JSON.stringify(data);
  fs.writeFile("./data/cart.json", data, () => {
    res.status(200).send("successfully added To Cart");
    res.end();
  });
});

app.post("/update-warehouse", (req, res) => {
  let data = req.body.data;
  data = JSON.stringify(data);
  fs.writeFile("./data/warehouse_stock.json", data, () => {
    res.status(200).send("successfully added To Cart");
    res.end();
  });
});

app.listen(7070);
