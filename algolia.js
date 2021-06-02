const indexing = require('algolia-indexing')
const fs = require('fs')

const apiKey = process.argv[2]

const credentials = { appId: '27CIRMYZIB', apiKey: apiKey, indexName: 'codemagic_docs' }
const records = JSON.parse(fs.readFileSync('./public/index.json'))

indexing.fullAtomic(credentials, records);