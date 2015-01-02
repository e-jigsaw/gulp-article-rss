assert = require 'power-assert'
rss = require '../src/index.coffee'
gulp = require 'gulp'
through = require 'through2'
{parseString} = require 'xml2js'

it 'should generate rss feed', (done)->
  stream = rss
    title: 'title'
    description: 'description'
    feed_url: 'http://li.nk/rss.xml'
    site_url: 'http://li.nk'
    image_url: 'http://li.nk/image.png'
    author: 'author'
    copyright: 'MIT'
    pubDate: new Date 2014, 12, 29

  gulp.src 'test/fixtures/*.md'
    .pipe stream
    .pipe through.obj (file, encoding, callback)->
      actual = parseString file.contents.toString(), (err, res)->
        assert.equal res.rss.channel[0].title, 'title'
        assert.equal res.rss.channel[0].description, 'description'
        assert.equal res.rss.channel[0].item[0].title[0], 'test'
        assert.equal res.rss.channel[0].item[0].link[0], 'http://li.nk/2014/12/29/title.html'
        done()
