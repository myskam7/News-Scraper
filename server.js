var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var router = express.Router();
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;


var app = express();

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

router.get("/", function (req, res) {
  res.render("index");
});


router.get("/savedarticles", function (req, res) {


  Article.find({}, function (error, doc) {

    if (error) {
      console.log(error);
    }

    else {
      var hbsArticleObject = {
        articles: doc
      };

      res.render("savedarticles", hbsArticleObject);
    }
  });
});

router.post("/scrape", function (req, res) {


  request("http://www.nytimes.com/", function (error, response, html) {

    var $ = cheerio.load(html);


    var scrapedArticles = {};

    $("article h2").each(function (i, element) {


      var result = {};


      result.title = $(this).children("a").text();

      console.log("What's the result title? " + result.title);

      result.link = $(this).children("a").attr("href");

      scrapedArticles[i] = result;

    });

    console.log("Scraped Articles object built nicely: " + scrapedArticles);

    var hbsArticleObject = {
      articles: scrapedArticles
    };

    res.render("index", hbsArticleObject);

  });
});

router.post("/save", function (req, res) {

  console.log("This is the title: " + req.body.title);

  var newArticleObject = {};

  newArticleObject.title = req.body.title;

  newArticleObject.link = req.body.link;

  var entry = new Article(newArticleObject);

  console.log("We can save the article: " + entry);


  entry.save(function (err, doc) {

    if (err) {
      console.log(err);
    }

    else {
      console.log(doc);
    }
  });

  res.redirect("/savedarticles");

});

router.get("/delete/:id", function (req, res) {

  console.log("ID is getting read for delete" + req.params.id);

  console.log("Able to activate delete function.");

  Article.findOneAndRemove({ "_id": req.params.id }, function (err, offer) {
    if (err) {
      console.log("Not able to delete:" + err);
    } else {
      console.log("Able to delete, Yay");
    }
    res.redirect("/savedarticles");
  });
});

router.get("/notes/:id", function (req, res) {

  console.log("ID is getting read for delete" + req.params.id);

  console.log("Able to activate delete function.");

  Note.findOneAndRemove({ "_id": req.params.id }, function (err, doc) {
    if (err) {
      console.log("Not able to delete:" + err);
    } else {
      console.log("Able to delete, Yay");
    }
    res.send(doc);
  });
});


router.get("/articles/:id", function (req, res) {

  console.log("ID is getting read" + req.params.id);


  Article.findOne({ "_id": req.params.id })

    .populate('notes')

    .exec(function (err, doc) {
      if (err) {
        console.log("Not able to find article and get notes.");
      }
      else {
        console.log("We are getting article and maybe notes? " + doc);
        res.json(doc);
      }
    });
});


router.post("/articles/:id", function (req, res) {

  var newNote = new Note(req.body);

  newNote.save(function (error, doc) {

    if (error) {
      console.log(error);
    }
    else {

      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { notes: doc._id } }, { new: true, upsert: true })

        .populate('notes')

        .exec(function (err, doc) {
          if (err) {
            console.log("Cannot find article.");
          } else {
            console.log("On note save we are getting notes? " + doc.notes);
            res.send(doc);
          }
        });
    }
  });
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", router);

mongoose.connect("mongodb://heroku_gnzk5747:4d2121nhgnfbdl1pfirsdepk9n@ds125262.mlab.com:25262/heroku_gnzk5747");

var db = mongoose.connection;

db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});

app.listen(PORT, function () {
  console.log("App running on PORT " + PORT);
});
