var exec = require('child_process').exec;

function build() {
  exec(
    [
      "cp src/transparency.js lib/",
      "cp spec/*.js browser/spec",
      "uglifyjs lib/transparency.js > lib/transparency.min.js"
    ].join(' && '),
    function(err, stdout, stderr) {
      if (err) return console.error(stderr.trim());
    }
  );
}

build();

