import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 4000;
const { Schema } = mongoose;

// let posts = [
//   {
//     id: 1,
//     title: "The Rise of Decentralized Finance",
//     content:
//       "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
//     author: "Alex Thompson",
//     date: "2023-08-01T10:00:00Z",
//   },
//   {
//     id: 2,
//     title: "The Impact of Artificial Intelligence on Modern Businesses",
//     content:
//       "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
//     author: "Mia Williams",
//     date: "2023-08-05T14:30:00Z",
//   },
//   {
//     id: 3,
//     title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
//     content:
//       "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
//     author: "Samuel Green",
//     date: "2023-08-10T09:15:00Z",
//   },
// ];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/ownApiDB');

const userSchema = new Schema({
  id: String,
  title: String,
  content: String,
  author: String,
  data: String,
});

const Blog = mongoose.model('Blog', userSchema);

const item1 = new Blog({
  id: 1,
  title: "The Rise of Decentralized Finance",
  content:
    "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
  author: "Alex Thompson",
  date: "2023-08-01T10:00:00Z",
})

// const item2 = new Blog({
//   id: 2,
//   title: "The Impact of Artificial Intelligence on Modern Businesses",
//   content:
//     "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
//   author: "Mia Williams",
//   date: "2023-08-05T14:30:00Z",
// })

// const item3 = new Blog({
//   id: 3,
//   title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
//   content:
//     "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
//   author: "Samuel Green",
//   date: "2023-08-10T09:15:00Z",
// })

// const items = [item1, item2, item3];

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
    date: new Date()
  })
  lastId = newId;
  anotherItem.save();
  res.json(anotherItem).status(201);
})

app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingPost = posts.find((post) => post.id === id);
  const updatedPost = {
    id: id,
    title: req.body.title || existingPost.title,
    content: req.body.content || existingPost.content,
    author: req.body.author || existingPost.author,
    date: new Date()
  }
  const searchIndex = posts.findIndex((post) => post.id === id);
  posts[searchIndex] = updatedPost;
  res.json(updatedPost);
})

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `Id ${id} not found` });
  }
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
