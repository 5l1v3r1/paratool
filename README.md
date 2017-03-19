# paratool

This uses [PhantomJS](https://github.com/ariya/phantomjs) and [paraphrasing-tool.com](http://paraphrasing-tool.com/) to create paraphrases of strings.

# Usage

You must have Docker installed. First, build the image:

```
$ docker build -t paratool .
```

Next, you can paraphrase a string:

```
$ export MESSAGE="The quick brown fox jumps over the lazy dog."
$ docker run --rm paratool paraphrase "$MESSAGE"
The brisk chestnut fox bounced over the sluggish puppy.
```
