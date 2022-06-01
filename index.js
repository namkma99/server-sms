const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cors = require('cors')
const cron = require('node-cron');
const database = require('./firebaseConfig');
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors())
// app.get('/api/greeting', (req, res) => {
//   const name = req.query.name || 'World';
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });
app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

cron.schedule('* * * * *',async () => {
  console.log('running a task every minute');
  database.ref('students').once('value')
  .then(function(snapshot) {
      console.log( snapshot.val() )
  })
});

app.listen(3000, () =>
  console.log('Express server is running on localhost:3000')
);


// cron.schedule('00 8 * * *', function(){
//   const message = '@everyone have a good day guys!';
//  client.messages
//   .create({
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: "+84373690243",
//     body: "Test send sms"
//   })
// });


