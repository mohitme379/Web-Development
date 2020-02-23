const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const items = [];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.post("/", (req, res) => {
  const newListItem = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(newListItem);
    res.redirect("/work");
  } else {
    items.push(newListItem);
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  const day = date.getDate();

  res.render("list", { listTitle: day, items: items });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", items: workItems });
});

app.listen(3000, () => {
  console.log("Server is Started !");
});
