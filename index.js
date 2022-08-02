const parser = require('ass-parser')
const stringify = require('ass-stringify')
const fs = require('fs')
const util = require('util')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function main (files, targetFolder) {
  const commentStyleName = 'Comment_' + Math.random().toString(36).substring(2, 8)
  const newSubtitles = []

  for (const file of files) {
    if (file.includes('.comments.ass')) continue

    const data = await readFile(file, 'utf-8')
    const ass = parser(data, { comments: true })

    const eventsSection = ass.find(e => e.section === 'Events').body
    const commentedDialogues = eventsSection.filter(e => {
      return e.key === 'Dialogue' && e.value.Text.match(/\{[^}\\]+\}/)
    })
    if (commentedDialogues.length === 0) continue

    commentedDialogues.forEach(e => {
      const value = e.value
      const commentText = value.Text.match(/\{[^}\\]+\}/g).map(e => e.replace(/^\{|\}$/g, '')).join('; ')
      const newValue = Object.assign({}, value, {
        Layer: 50,
        Style: commentStyleName,
        Text: '{\\q0}[NT: ' + commentText + ']'
      })
      eventsSection.push({
        key: 'Dialogue',
        value: newValue
      })
    })

    const styleSection = ass.find(e => e.section.includes('Styles')).body
    const firstStyle = styleSection.find(e => e.key === 'Style').value
    styleSection.push({
      key: 'Style',
      value: {
        ...firstStyle,
        Name: commentStyleName,
        Fontsize: 15,
        Bold: -1,
        Italic: 0,
        BorderStyle: 1,
        Outline: 1,
        Shadow: 2,
        Alignment: 8,
        MarginL: 10,
        MarginR: 10,
        MarginV: 10,
        AlphaLevel: 0
      }
    })

    const result = stringify(ass)
    const filename = path.basename(file)
    const newFilename = filename.replace('.ass', '.comments.ass')
    const targetPath = path.resolve(targetFolder || path.dirname(file), newFilename)
    await writeFile(targetPath, result)
    newSubtitles.push(targetPath)
  }

  return { newSubtitles }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = main
