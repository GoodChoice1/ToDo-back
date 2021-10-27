const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const sequelize = require('./DataBase');
const databaseController = require('./databaseController');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.startDb();

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

app.post('/db', databaseController.database_post)
app.get('/db', databaseController.database_get)
app.put('/db', databaseController.database_put)
app.delete('/db', databaseController.database_delete_all)
app.delete('/db/:index', databaseController.database_delete_todo)

http.createServer(app).listen(3000, () => {
  console.log('Server is working on port 3000');
})