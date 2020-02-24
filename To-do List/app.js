const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolist", {
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

// app.get("/work", (req, res) => {
//   res.render("list", { listTitle: "Work List", items: workItems });
// });

app.listen(3000, () => {
  console.log("Server is Started !");
});
