(function() {
  var RSS, gutil, path, through;

  gutil = require('gulp-util');

  through = require('through2');

  RSS = require('rss');

  path = require('path');

  module.exports = function(opt) {
    var base, cwd, feed, flush, transform;
    cwd = base = null;
    feed = new RSS(opt);
    transform = function(file, encoding, callback) {
      var article, url;
      if (cwd === null) {
        cwd = file.cwd;
      }
      if (base === null) {
        base = file.base;
      }
      article = file.contents.toString().split('\n');
      url = /^(\d{4})-(\d{2})-(\d{2})-(.*)\.md/.exec(path.basename(file.path));
      feed.item({
        title: /^# \[(.*)\]/.exec(article[0])[1],
        description: article.slice(2, 5).join('\n'),
        url: "" + opt.site_url + "/" + url[1] + "/" + url[2] + "/" + url[3] + "/" + url[4] + ".html",
        date: new Date(url[1], parseInt(url[2]) - 1, url[3])
      });
      return callback();
    };
    flush = function(callback) {
      this.push(new gutil.File({
        cwd: cwd,
        base: base,
        path: path.resolve(cwd, 'feed.xml'),
        contents: new Buffer(feed.xml())
      }));
      return callback();
    };
    return through.obj(transform, flush);
  };

}).call(this);
