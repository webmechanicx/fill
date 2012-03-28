var app;
var express = require("express");
var $ = require("jquery");

require("fill");

app = module.exports = express.createServer();

app.configure(function() {
  app.use(app.router);
});

app.configure("development", function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.get("/", function(req, res) {
  var template = $('<div><h1 class="title"></h1></div>');
  var result = template.render({
    title: "Hello world!"
  });
  res.send(result.html());
});

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

