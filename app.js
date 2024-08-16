const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

  const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
  });

  const Article = mongoose.model("Article", articleSchema);

  //////////////////////// Routing for a Atricles ////////////////////

  app
    .route("/articles")
    .get(async (req, res) => {
      try {
        const articles = await Article.find({});
        res.send(articles);
        console.log(articles);
      } catch (err) {
        console.log(err);
      }
    })
    .post(async (req, res) => {
      try {
        const articles = await Article.find({});
        res.send(articles);
        console.log(articles);
      } catch (err) {
        console.log(err);
      }
    })
    .put(async (req, res) => {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      // await newArticle.save();
      try {
        const newarticles = await newArticle.save();
        res.send("successfully added a new articles");
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });

  /////////////////// Requesting for a specific Atricle Title /////////////////////

  app
    .route("/articles/:articleTitle")
    .get(async (req, res) => {
      await Article.findOne({ title: req.params.articleTitle })
        .then(async (docs) => {
          if (docs) {
            res.send(docs);
          } else {
            res.send("No articles matching that title was found.");
          }
        })
        .catch(async (err) => {
          console.log(err);
        });
    })
    .put(async (req, res) => {
      await Article.updateOne(
        { title: req.params.articleTitle },
        {
          title: req.body.title,
          content: req.body.content,
        }
      )
        .then(async (docs) => {
          res.send("Successfully Updated");
        })
        .catch(async (err) => {
          res.send(err);
        });
    })
    .patch(async (req, res) => {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body }
      )
        .then(async (docs) => {
          if (docs) {
            res.send("Successfull update is done");
          }
        })
        .catch(async (err) => {
          res.send(err);
        });
    })
    .delete(async (req, res) => {
      await Article.deleteOne({ title: req.params.articleTitle })
        .then(async (docs) => {
          if (docs) {
            res.send("Successfully deleted related articles");
          }
        })
        .catch(async (err) => {
          res.send(err);
        });
    });

  app.listen(3000, () => {
    console.log("Server is working on port 3000");
  });
}
