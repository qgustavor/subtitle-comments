# Subtitle Comments

Transform comments in ASS subtitles in translation notes.

This is the original script made in May 2019 that works on .ass files. If you wish this feature when watching anime online get [the Better Anime Subtitles Firefox add-on](https://github.com/qgustavor/subtitle-word-replacer/releases/latest).

## Why?

Because translators leave a lot of important details in comments to their work colleagues that watchers could be interested and would fit quite well as translation notes.

Also because they also leave a lot of inside jokes too.

## CLI usage

Run `node index.js *.ass` and it will create a `*.comments.js` for every file matched.

## Programatic usage

```javascript
const generateSubtitleComments = require('./path/to/index.js')

generateSubtitleComments([ 'file 1.ass', 'file 2.ass' ]).then(() => {
  // It creates a `.comments.js` file for each source file
})
```

Want a NPM package? Open an issue. Want a better programatic API? Open a pull request.
