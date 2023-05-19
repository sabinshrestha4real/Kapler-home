const express = require("express");

const router = express.Router();

const Blog = require("../models/blogModel");

//Endpoint to create blog
router.post("/create", async (req, res) => {
  try {
    let newBlog = await Blog.create({
      title: req.body.name,

      description: req.body.description,
    });

    res.json({
      message: "Blog has been created",

      data: newBlog,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});
//Enpoint to get all te blogs
router.get("/get", async (req, res) => {
  try {
    let allBlogs = await Blog.find({});
    res.json({ message: "All blogs fetched", data: allBlogs });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//End point to delete blog
//dynamic id to delete specific blog
router.delete("/delete/:id", async (req, res) => {
  try {
    let deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blogs deleted", data: deletedBlog });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Endpoinnt to update blog
router.put("/update/:id", async (req, res) => {
  try {
    let updateBlog = await Blog.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.name,
        description: req.body.description,
      }
    );
    res.json({
      message: `${req.body.name} updated`,
      data: updateBlog,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
