const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 8000
var jsonParser = bodyParser.json()

app.use(cors())

const url= 'mongodb://localhost:27017'

var getAccountNames = (db, callback) => {
    var collection = db.collection('accounts')
    collection.find({}).toArray((err, docs) => {
        console.log('found the following records')
        callback(docs)
    })
}

var getAccountsLessThan = (db, callback) => {
    var collection = db.collection('accounts')
    collection.find({"balance":{$lt: 100}}).toArray((err, docs) => {
        console.log('found the following records that are less than 100.')
        callback(docs)
    })

}

var getAccountsGreaterThan = (db, callback) => {
    var collection = db.collection('accounts')
    collection.find({"balance":{$gt: 300}}).toArray((err, docs) => {
        console.log('found the following records that are less than 100.')
        callback(docs)
    })

}

var addFundsToAccount = (db, personName, newFunds) => {
    var collection = db.collection('accounts')
    collection.updateOne({name: personName}, {$set: {"balance": newFunds}})
}

var removeFundsFromAccount = (db, personName, newFunds) => {
    var collection = db.collection('accounts')
    collection.updateOne({name: personName}, {$set: {"balance": newFunds}})
}

var addCreditCardAndBalance = (db, personName, newCreditCard, newCardBalance) => {
    var collection = db.collection('accounts')
    collection.insertMany([{}])
}




app.get ('/bank', function (req, res) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected to MongoDb')
        let db = client.db('SQBank')

        let result = getAccountNames(db, (documentsReturned)  => {
            console.log(documentsReturned)
            res.json(documentsReturned)
        })
        client.close()
    })
})

app.get ('/bank/poor', function (req, res) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected to MongoDb')
        let db = client.db('SQBank')

        let result = getAccountsLessThan(db, (documentsReturned) => {
               console.log(documentsReturned)
               res.json(documentsReturned)
        })
    })
})

app.get ('/bank/rich', function (req, res) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected to MongoDb')
        let db = client.db('SQBank')

        let result = getAccountsGreaterThan(db, (documentsReturned) => {
            console.log(documentsReturned)
            res.json(documentsReturned)
        })
    })
})

app.put ('/bank/addfunds', jsonParser, (req, res) => {
    const personName = req.body.name
    const newFunds = req.body.balance

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected to MongoDb')
        let db = client.db('SQBank')

        let result = addFundsToAccount(db, personName, newFunds)
        res.send("funds added")
        client.close()
    })
})

app.put ('/bank/removefunds', jsonParser, (req, res) => {
    const personName = req.body.name
    const newFunds = req.body.balance

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected to MongoDb')
        let db = client.db('SQBank')

        let result = removeFundsFromAccount(db, personName, newFunds)
        res.send("funds removed")
        client.close()
    })
})

app.listen(port, () => console.log(`app listening on port ${port}`))