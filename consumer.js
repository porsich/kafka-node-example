let kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client('192.168.2.85:2181'),
    consumer = new Consumer(client, [ { topic: 'foo', partition: 0 } ], { autoCommit: false });
let fs = require('fs');
let wstream = fs.createWriteStream('./metadata/myOutput.json');

consumer.on('message', function (message) {
    console.log("message", message);
    let data = new Buffer(message.value, 'base64')
    wstream.write(data);
});

consumer.on('error', function (error) {
    console.log("error", error);
});

consumer.on('offsetOutOfRange', function (offsetOutOfRange) {
    console.log("offsetOutOfRange", offsetOutOfRange);
});
