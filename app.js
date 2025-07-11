var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var userRouter = require('./router/user');
var unitRouter = require('./router/unit');
var absenRouter = require('./router/absen');
const database = require("./model/index");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

var app = express();
app.listen(8000, () => {
  console.log(`Server running at http://localhost:${8000}`);
});
app.use('/uploads', express.static('uploads'));
app.use('/absen', express.static('absen'));
// use cors
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
database
  .sync()
  .then(() => {
    console.info("database synced");
  })
  .catch((err) => {
    console.error("failed to sync database: " + err.message);
  });
  
  // Swagger definition
  const swaggerOptions = {
      swaggerDefinition: {
          openapi: '3.0.0',
          info: {
              title: 'My API',
              version: '1.0.0',
              description: 'API documentation using Swagger',
          },
          servers: [
              {
                  url: `http://localhost:${8000}`,
              },
          ],
     components: {
       securitySchemes: {
           bearerAuth: {
               type: 'http',
               scheme: 'bearer',
               bearerFormat: 'JWT', 
           },
       },
   },
      },
      apis: ['./router/user.js','./router/unit.js','./router/absen.js'], // Path to your API docs
  };

  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use('/users', userRouter);
  app.use('/units', unitRouter);
  app.use('/', absenRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
