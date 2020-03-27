const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://mohit:possible@cluster0-ptvbp.mongodb.net/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.post("/", (req, res) => {
  const newListItem = req.body.newItem;

  const item = new Item({
    name: newListItem
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId, err => {
    if (!err) {
      console.log("deleted item");
      res.redirect("/");
    }
  });
});

app.get("/", (req, res) => {
  const day = date.getDate();

  Item.find({}, (err, result) => {
    if (result.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) console.log(err);
        else console.log("Records Inserted");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, items: result });
    }
  });
});

app.get("/:paramName", (req, res) => {
  const paramName = req.params.paramName;

  const list = new List({
    name: paramName,
    items: defaultItems
  });
  list.save();
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Started !");
});
