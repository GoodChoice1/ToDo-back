const express = require('express');
const http = require('http');
const cors = require('cors');
const { rawListeners } = require('process');
const e = require('express');
const { consumers } = require('stream');
let array = []

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

let localArr = localStorage.getItem('arr')

if (localArr !== undefined) {
  array = localArr.split(',')
}

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);

  next();
});


function isUpper(x) {
  return x == x.toUpperCase()
}

function isLetter(x) {
  return (x >= 'a' && x < 'z') || (x >= 'A' && x <= 'Z')
}

app.get('/sum', (req, res) => {
  let a = parseInt(req.body.a)
  let b = parseInt(req.body.b)
  res.status(200).json({ message: a + b });
})

app.get('/reverseCase', (req, res) => {
  let a = req.body.a
  let answer = ""
  for (let i = 0; i < a.length; i++) {
    if (isLetter(a[i])) {
      if (isUpper(a[i])) {
        answer += a[i].toLowerCase()
      }
      else {
        answer += a[i].toUpperCase()
      }
    }
    else {
      answer += a[i]
    }
  }
  res.status(200).json({ message: answer });
})

app.get('/reverseArray', (req, res) => {
  let a = req.body.a.reverse()
  res.status(200).json({ message: a });
})

app.get('/strings', (req, res) => {
  res.status(200).json({ message: array });
})

app.post('/strings', (req, res) => {
  let a = req.body.a
  array.push(a)
  localStorage.setItem('arr', array);
  res.status(200).json({ message: "Added: " + a });
})

app.delete('/strings/:index', (req, res) => {
  var id = parseInt(req.params.index) - 1
  array.splice(id, 1)
  localStorage.setItem('arr', array);
  res.status(200).json({ message: array });
})

app.delete('/strings', (req, res) => {
  array = []
  localStorage.setItem('arr', undefined);
  res.status(200).json({ message: "Array deleted" });
})

http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
})