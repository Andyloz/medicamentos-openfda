import JsonToTS from 'json-to-ts'
import fs from 'node:fs'

const json = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))

JsonToTS(json).forEach( typeInterface => {
  console.log(typeInterface)
})