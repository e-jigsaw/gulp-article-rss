(function() {
  var Feed, gutil, path, through;

  gutil = require('gulp-util');

  through = require('through2');

  Feed = require('feed');

  path = require('path');

  module.exports = function(opt) {
    var base, cwd, feed, flush, transform;
    cwd = base = null;
    feed = new Feed(opt);
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
      feed.addItem({
        title: /^# \[(.*)\]/.exec(article[0])[1],
        link: "" + opt.link + "/" + url[1] + "/" + url[2] + "/" + url[3] + "/" + url[4] + ".html",
        description: article.slice(5).join('\n'),
        author: opt.author,
        date: new Date(url[1], url[2], url[3])
      });
      return callback();
    };
    flush = function(callback) {
      this.push(new gutil.File({
        cwd: cwd,
        base: base,
        path: path.resolve(cwd, 'feed.xml'),
        contents: new Buffer(feed.render('rss-2.0'))
      }));
      return callback();
    };
    return through.obj(transform, flush);
  };

}).call(this);
