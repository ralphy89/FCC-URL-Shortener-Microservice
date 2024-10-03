require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const {lookup} = require("node:dns");
const https = require("node:https");
const { URL } = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var dict = {};
var value = 0;
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:number', function(req, res) {
    let number = req.params.number;
    console.log(dict[number]);
    res.redirect(dict[number]);
});



app.post('/api/shorturl', function (req, res, done) {
  let url = req.body.url;
  const urlObj = new URL(url.toString());
  lookup(urlObj.hostname, function(err, data_) {
    if(err){
      console.log(err);
      return res.json({ "error": 'invalid url' });
    };
    console.log("Site valide");
    dict[value + 1] = url;
    value += 1;
    let data = {'original_url': url, 'short_url': value};
    res.json(data);
    done(null, data_)
  });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
