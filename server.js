const fs = require("fs");
const express = require('express');
const http = require("http");
const mongoClient = require('mongodb').MongoClient;
const app = express();
const https = require('https')
const controller = require('./data/controller')
config = require('config');



app.set('port', config.get('PORT'));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,access_token, api_key, content-type,versions');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // webVersion header for each request
    // res.setHeader('versions', config.get('webVersion'));

    next();
});
// const http = require('http');
var startServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('into startServerat port ', app.get('port'));
     readFile((err, result) => {
       startInitialProcess()

      })
});


function startInitialProcess() {

    mongoClient.connect(config.get('mongo_db_connection'), function (err, client) {
        if (err) {
            console.log('mongo connection error')
            throw err;
        }

        console.log('mongodb connected successfully')
        db = client.db(config.get('databaseName'));


        var readline = require('readline');
        var stream = require('stream');
        var instream = fs.createReadStream('mydata.txt');
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        console.log('***************...', db);

        rl.on('line', function (line) {
            try {
                console.log('line here')
                if (line) {
                    console.log('here line is this', line, typeof (line))
                    var record = line.split('\t');
                    if (record && record.length > 0 && record[0] !== ' ') {
                        console.log('array is this', record)
                        const arr = record.toString().split(';');
                        if (arr && arr[0] && arr[0] !== ' ') {
                            console.log('array of o is', arr[0], typeof (arr[0]))
                            var object = {
                                'SchemaCode': arr[0],
                                'ISINDivPayout': arr[1],
                                'ISINDivReinvestment': arr[2],
                                'SchemaName': arr[3],
                                'NetAssetValue': arr[4],
                                'Date': new Date(arr[5])
                            };
                            console.log('object is', object)
                                db.collection('datacollection').insert(object);
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        });

        rl.on('close', function () {
            // client.close();
            console.log('***************completed');
        });

    });
}



app.get('/searchData', controller.searchData);


function readFile(cb) {


    const file = fs.createWriteStream("mydata.txt");

    https.get("https://www.amfiindia.com/spages/NAVAll.txt", response => {
        var stream = response.pipe(file);

        stream.on("finish", function () {
            console.log("done");

            cb();
        });
    });

}