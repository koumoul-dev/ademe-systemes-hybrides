const fs = require('fs-extra')
const path = require('path')
const klawSync = require('klaw-sync')
const endOfLine = require('os').EOL
const util = require('util')
const readFile = util.promisify(fs.readFile)
const moment = require('moment')

const inputFolder = 'suivi_systemes_hybrides'
const outputFile = 'suivi-systemes-hybrides.csv'

const files = klawSync(path.join(__dirname, inputFolder), {nodir: true}).map(f => f.path).filter(f => f.split('.').pop() === 'evt-log')

const fields = {
  // site: 'Site',
  datetime: 'Date et horaire de mesure',
  // date: 'Date de mesure',
  // time: 'Horaire de mesure',
  sensor: 'Capteur',
  // file: 'Fichier',
  type: 'Type',
  variable: 'Variable',
  value: 'Valeur',
  unit: 'Unité'
};
// 160701-000031.244000	power	puissanceA2	24317.44	{"unit": "kW"}

(async function(){
  const writeStream = fs.createWriteStream(path.join(__dirname, outputFile))
  // const write = util.promisify(writeStream.write)
  // writeStream.write(Object.values(fields).map(f => `"${f}"`).join(',') + endOfLine)
  writeStream.write(Object.values(fields).join(',') + endOfLine)
  for (file of files){
    const toks = file.split('/')
    const fileName = toks.pop()
    const sensor = toks.pop()
    const lines = (await readFile(file, 'utf-8')).split('\n')
    process.stdout.write(sensor + ' - ' + fileName + ' : ')
    let prevHour = ''
    for (line of lines){
      const toks = line.split('\t')
      if(toks.length === 5){
        const datetime = moment(toks[0].substring(0, 17), 'YYMMDD-HHmmss.SSS').toISOString()
        const [date, time] = toks[0].split('-')
        const unit = JSON.parse(toks[4])
        const record = {
          datetime,
          // date: `20${date.substring(0,2)}-${date.substring(2,4)}-${date.substring(4,6)}`,
          // time: `${time.substring(0,2)}:${time.substring(2,4)}:${Math.round(time.substring(4,9))}+01:00`,
          sensor,
          // file: fileName,
          type: toks[1],
          variable: toks[2],
          value: toks[3],
          unit: unit.unit
        }

        // writeStream.write(Object.keys(fields).map(f => record[f] ? `"${record[f].replace(/"/g, '""')}"` : '').join(',') + endOfLine)
        writeStream.write(Object.keys(fields).map(f => record[f] || '').join(',') + endOfLine)
        if(prevHour !== time.substring(0,2)){
          prevHour = time.substring(0,2)
          process.stdout.write('.')
        }
      }
    }
    console.log()
  }
  writeStream.end()
})()
