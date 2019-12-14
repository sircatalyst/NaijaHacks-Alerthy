const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const passport = require('passport');

const passportConfig = require('./config/passport');
const swaggerDocument = require('./docs/swagger');

// routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const alertRoute = require('./routes/alertRoute');
const adminRoute = require('./routes/adminRoute');
const messageRoute = require('./routes/messageRoute');
const recipientRoute = require('./routes/recipientRoute');

// initialize express
const app = express();

// integrate passport middleware
app.use(passport.initialize());

// Passport configuration
passportConfig(passport);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// CORS
app.use(cors());

// loggers
app.use(logger('dev'));

// Index page
app.get('/', (req, res) => res.send('Let us hack Nigeria Citizen Safety bug!'));

// app.use(routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// create api routes prefix
const prefix = '/api/v1';

app.use(`${prefix}/`, authRoute);
app.use(`${prefix}/users`, userRoute);
app.use(`${prefix}/alerts`, alertRoute);
app.use(`${prefix}/messages`, messageRoute);
app.use(`${prefix}/recipients`, recipientRoute);
app.use(`${prefix}/ghost`, adminRoute);

// handles non-existing routes
app.all('*', (req, res) => res.status(404).json({ error: 'route not found' }));

module.exports = app;