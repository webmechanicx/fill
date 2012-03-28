var exec = require('child_process').exec;

function build() {
  exec(
    [
      "cp src/fill.js lib/",
      "cp spec/*.js browser/spec",
      "uglifyjs lib/fill.js > lib/fill.min.js"
    ].join(' && '),
    function(err, stdout, stderr) {
      if (err) return console.error(stderr.trim());
    }
  );
}

build();

