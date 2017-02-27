let kafka = require('kafka-node');
let fs = require("fs");
let Producer = kafka.Producer;
let Client = kafka.Client;
let client = new Client('192.168.2.85:2181');
let producer = new Producer(client, { requireAcks: 1 });
let topic = 'foo';
let p = 0;
let a = 0;

let readStream = fs.createReadStream('./metadata/test.json');

client.once('connect', function () {
    client.loadMetadataForTopics([topic], function (error, results) {
      if (error) {
      	return console.error(error);
      }
      console.log(results[1].metadata);
    });
});

producer.on('ready', function () {
    readStream
        .on('data', function (chunk) {
            producer.send([
                { topic: topic, partition: p, messages: [chunk.toString('base64')], attributes: a }
            ], function (err, result) {
                console.log('message SENT');
            });
        })
        .on('end', function () {
            console.log('end');
        });



});

producer.on('error', function (err) {
  console.log('error', err);
});