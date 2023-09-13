import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 4000;
const { Schema } = mongoose;

let lastId = 1;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/ownApiDB');

const userSchema = new Schema({
  id: String,
  title: String,
  content: String,
  author: String,
});

const Blog = mongoose.model('Blog', userSchema);

const item1 = new Blog({
  id: 1,
  title: "The Rise of Decentralized Finance",
  content:
    "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
  author: "Alex Thompson",
})

app.get("/posts", (req, res) => {

  async function read() {
    const foundItems = await Blog.find({});
    if (foundItems.length == 0) {
      item1.save();
      res.json(item1);
    }
    else {
      res.json(foundItems);
    }
  }
  read();

})

app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  async function find() {
    const foundById = await Blog.findOne({ id: id });
    if (!foundById) {
      return res.status(404)
        .json({ message: "Post not found" });
    }
    else {
      res.json(foundById);
    }
  }
  find();
})

app.post("/posts", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const newId = lastId += 1;

  const anotherItem = new Blog({
    id: newId,
    title: title,
    content: content,
    author: author,
  })
  lastId = newId;
  anotherItem.save();
  res.json(anotherItem).status(201);
})

app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  async function find() {
    await Blog.findOneAndUpdate({ id: id },
      {
        id: id,
        title: req.body.title || existingPost.title,
        content: req.body.content || existingPost.content,
        author: req.body.author || existingPost.author,
      })
  }
  find();
  res.json(id);
})

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  async function del() {
    await Blog.deleteOne({ id: id });
  }
  del();
  res.json(id);
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
