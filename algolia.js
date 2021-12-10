const algoliasearch = require('algoliasearch')
const fs = require('fs')

const apiKey = process.argv[2]

const client = algoliasearch('27CIRMYZIB', apiKey)
const index = client.initIndex('codemagic_docs')

const newObjects = JSON.parse(fs.readFileSync('./public/index.json'))
    .map((newObject) => ({
        ...newObject,
        objectID: newObject.uri,
    }))
    .filter(({ uri }) => uri !== '/404/' && !uri.startsWith('/partials/'))

const findObjectById = (objects, target) => objects.find(({ objectID }) => objectID === target)

const getChangedObjects = (newObjects, oldObjects) =>
    newObjects
        .map((newObject) => {
            const oldObject = findObjectById(oldObjects, newObject.objectID)
            if (!oldObject) return newObject

            const differentAttributes = Object.entries(newObject).filter(([key, value]) => value !== oldObject[key])
            return differentAttributes.length
                ? {
                      objectID: newObject.objectID,
                      ...Object.fromEntries(differentAttributes),
                  }
                : false
        })
        .filter(Boolean)

let oldObjects = []

index
    .browseObjects({
        query: '',
        batch: (batch) => {
            oldObjects = oldObjects.concat(batch)
        },
    })
    .then(() => {
        const objectIDsToDelete = oldObjects
            .map(({ objectID }) => objectID)
            .filter((oldObjectId) => !findObjectById(newObjects, oldObjectId))

        const changes = getChangedObjects(newObjects, oldObjects)

        index.deleteObjects(objectIDsToDelete).catch((error) => console.error(error))
        index.partialUpdateObjects(changes, { createIfNotExists: true }).catch((error) => console.error(error))
    })
    .catch((error) => console.error(error))
