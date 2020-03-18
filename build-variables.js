const fs = require('fs-extra')
const path = require('path')
const klawSync = require('klaw-sync')
const util = require('util')
const readFile = util.promisify(fs.readFile)

const inputFolder = 'suivi_systemes_hybrides'
const files = klawSync(path.join(__dirname, inputFolder), {nodir: true}).map(f => f.path).filter(f => f.split('.').pop() === 'evt-log');

(async function(){
  const variables = {}

  for (file of files){
    const toks = file.split('/')
    const fileName = toks.pop()
    const sensor = toks.pop()
    variables[sensor] = variables[sensor] || {}
    const lines = (await readFile(file, 'utf-8')).split('\n')
    process.stdout.write(sensor + ' - ' + fileName + ' : ')
    let prevHour = ''
    for (line of lines){
      const toks = line.split('\t')
      if(toks.length === 5){
        const [date, time] = toks[0].split('-')
        variables[sensor][toks[2]] = variables[sensor][toks[2]] || { unit: JSON.parse(toks[4]).unit || '', cpt: 0}
        variables[sensor][toks[2]].cpt++
        if(prevHour !== time.substring(0,2)){
          prevHour = time.substring(0,2)
          process.stdout.write('.')
        }
      }
    }
    console.log()
  }
  console.log(variables)
  fs.writeFileSync(path.join(__dirname, 'variables.json'), JSON.stringify(variables, null, 2))
})()
