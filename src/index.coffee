gutil   = require 'gulp-util'
through = require 'through2'
Feed    = require 'feed'
path = require 'path'

module.exports = (opt)->
  cwd = base = null
  feed = new Feed opt

  transform = (file, encoding, callback)->
    if cwd is null then cwd = file.cwd
    if base is null then base = file.base
    article = file.contents.toString().split '\n'
    url = /^(\d{4})-(\d{2})-(\d{2})-(.*)\.md/.exec path.basename(file.path)

    feed.addItem
      title: /^# \[(.*)\]/.exec(article[0])[1]
      link: "#{opt.link}/#{url[1]}/#{url[2]}/#{url[3]}/#{url[4]}.html"
      description: article.slice(5).join '\n'
      author: opt.author
      date: new Date url[1], url[2], url[3]

    callback()

  flush = (callback)->
    @push new gutil.File
      cwd: cwd
      base: base
      path: path.resolve cwd, 'feed.xml'
      contents: new Buffer feed.render('rss-2.0')
    callback()

  through.obj transform, flush
