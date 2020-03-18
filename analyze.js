const fs = require('fs-extra')
const path = require('path')
const endOfLine = require('os').EOL

const recordedVariables = require('./variables.json')

const metaVariablesLines = fs.readFileSync(path.join(__dirname, 'variables.csv'), 'utf-8').split('\n').slice(1).map(l => l.split(',')).filter(l => l.length)

let writeStream = fs.createWriteStream(path.join(__dirname, 'analyse-variables-meta.csv'))
writeStream.write('Site,Capteur,Variable,Unité théorique,Unité remontée' + endOfLine)

metaVariablesLines.forEach(line => {
  if(line.length === 8) writeStream.write(`${line[7]},${line[0]},${line[5]},${line[4]},${recordedVariables[line[0]][line[5]] !== undefined ? recordedVariables[line[0]][line[5]].unit : 'variable non présente'}` + endOfLine)
})
writeStream.end()

writeStream = fs.createWriteStream(path.join(__dirname, 'analyse-variables-remontees.csv'))
writeStream.write('Capteur,Variable,Unité remontée,Unité théorique' + endOfLine)

let cptKeep = 0
let cptRemove = 0

Object.keys(recordedVariables).forEach(capteur => {
  Object.keys(recordedVariables[capteur]).forEach(variable => {
    const line = metaVariablesLines.find(l => l[0] === capteur && l[5] === variable)
    writeStream.write(`${capteur},${variable},${recordedVariables[capteur][variable].unit},${ (line && line[4]) || 'variable non décrite'}` + endOfLine)
    if(line) cptKeep += recordedVariables[capteur][variable].cpt
    else cptRemove += recordedVariables[capteur][variable].cpt
  })
})

writeStream.end()

console.log('keep', cptKeep, 'remove', cptRemove)
