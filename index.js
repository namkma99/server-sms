const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cors = require('cors')
const cron = require('node-cron');
const database = require('./firebaseConfig');
const {ref, set, remove} = require('firebase/database')
const port = process.env.PORT || 5000;
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors())
const week = ['SUN','MON','TUE','WED', 'THU','FRI', 'SAT']

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
  const date = new Date();
  const day = date.getDay();
  let currentDayToString = getCurrentDay()
  const snapshotSubject = await database.ref('subjects').once('value')
  const snapshotStudent = await database.ref('students').once('value')
  
  let valueSubjects = snapshotSubject.val();
  let listSubject = [];
  let listSudent = [];
  for(let i in snapshotSubject.val()) {
    listSubject.push(valueSubjects[i])
  }
  for(let i in snapshotStudent.val()) {
    listSudent.push(snapshotStudent.val()[i])
  }
  const subject = listSubject.find(sub => {
    const dayInSubject = String(sub.dayOfWeek)
    if(dayInSubject.toUpperCase() === currentDayToString) {
      return sub
    }
  })
  const listKeyCheckIn = Object.keys(subject.checkInTime)
  const checkInTime = listKeyCheckIn.some((time => isToday(new Date(subject.checkInTime[time]))))
  console.log("checkInTime::", checkInTime);
  const currentDate = getCurrentDate()
  if(!checkInTime) {
    const data = {}
    for(let i in snapshotStudent.val()) {
      data[i] = ''
    }
    database.ref(`subjects/${day}/checkInTime/${currentDate}`).set(data) 
  } else {
    console.log("subject.checkInTime::", subject)
    const listFingerCheckIn = subject.checkInTime[`${currentDate}`]
    console.log("listFingerCheckIn::", listFingerCheckIn)
    const data = {}
    listSudent.forEach(student => {
      const isCheckStudent = Object.keys(listFingerCheckIn).some(key => listFingerCheckIn[key] === student.fingerId)
      if(!isCheckStudent) {
        console.log("isCheckStudent::", isCheckStudent)
        data[student.fingerId] = ''
        
      }
    })
    console.log("data::", data)
    database.ref(`subjects/${day}/checkInTime/${currentDate}`).set(data)
  }
});

cron.schedule('00 8 * * *',async () => {
  console.log('running a 8PM everyDay');
  const snapshotSubject = await database.ref('subjects').once('value')
  const snapshotStudent = await database.ref('students').once('value')
  
  let valueSubjects = snapshotSubject.val();
  let listSubject = [];
  let listSudent = [];
  for(let i in snapshotSubject.val()) {
    listSubject.push(valueSubjects[i])
  }
  for(let i in snapshotStudent.val()) {
    listSudent.push(snapshotStudent.val()[i])
  }
  listSubject = listSubject && listSubject.filter(subject => subject.id)
  const subject = listSubject.find(sub => {
    const dayInSubject = String(sub.dayOfWeek)
    if(dayInSubject.toUpperCase() === currentDay) {
      return sub
    }
  })
  // if(typeof subject !== undefined) {
  //   subject.checkInTime.
  // }
  // subject.
})

// app.get('/',async (req, res) => {
//   const snapshot = await database.ref('subjects').once('value')
//   let valueSubjects = snapshot.val();
//   let listSubject = [];
//   for(let i in snapshot.val()) {
//     listSubject.push(valueSubjects[i])
//   }
//   const subject = listSubject.find(sub => {
//     const dayInSubject = String(sub.dayOfWeek)
//     if(dayInSubject.toString().toUpperCase() === getCurrentDay()) {
//       return sub
//     }
//   })
//   const checkInTime = subject.checkInTime
//   const isCheckInTimeStudent = isToday(new Date(checkInTime))
//   console.log(isToday(new Date('2022-06-01'))); // 👉️ true
//   if(isCheckInTimeStudent === false) {
//     database.ref(`subjects/${day}/checkInTime/${'2022-06-01'}`).set({
//       12:''
//     })
//   } else {
//     database.ref(`subjects/${day}/checkInTime/${'2022-06-01'}`).set({
//       15:''
//     })
//   }
//   // database.ref(`subjects/${day}/checkInTime/${'2022-06-01'}`).set({
//   //   12:''
//   // })
//   // if(typeof subject !== 'undefined') {
//   //   res.send(subject);
//   // } else {
//   //   res.send('hello');
//   // }
// })

/*
const Max = 4
const leaveMax = 3
const data = {
    '2022-05-04': { '12': '17:06:08', '13': '17:21:04' },
    '2022-06-01': { '12': '17:06:08', '13': '17:06:08' },
    '2022-06-02': { '12': '17:06:08', '13': '17:06:08' },
    '2022-06-03': { '12': '', '13': '17:06:08' },
}
const arr = [];
Object.keys(data).forEach(key => arr.push(data[key]))
const student = [12,13];
arr.forEach((value,key) => {
    let listCheckIn = arr[key]
    let count = 0
    console.log("listCheckIn",listCheckIn)
    listCheckIn.forEach(check => {
    
        if(student.some(stu=>stu === Number(check))) {
            count = count + 1;
        }
        
    })
    console.log("count" + value + "::", count)
})

*/
app.post('/write', async (req, res) => {
  const date = new Date();
const day = date.getDay()
const snapshotStudent = await database.ref('students').once('value')
const data = {}
for(let i in snapshotStudent.val()) {
  data[i] = ''
}
  database.ref(`subjects/${day}/checkInTime/${getCurrentDate()}`).set(data)
  // await set(ref(database, `subject/${day}/checkInTime`), {
  //   name: "namTest"
  // })
  res.send('Test')
})

const isToday = (date) =>{
  const today = new Date();

  return today.toDateString() === date.toDateString();
}


const getCurrentDay = () => {
  const currentTimeDate = new Date()
  return week[currentTimeDate.getDay()]
}

const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

const formatDate = (dateFormat) => {
  const date = new Date(dateFormat)
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
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


