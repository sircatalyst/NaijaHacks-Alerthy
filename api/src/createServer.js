import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';

import passportConfig from './config/passport';
import swaggerDocument from './docs/swagger';

// routes
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import alertRoute from './routes/alertRoute';
import adminRoute from './routes/adminRoute';

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
app.use(`${prefix}/ghost`, adminRoute);

// handles non-existing routes
app.all('*', (req, res) => res.status(404).json({ error: 'route not found' }));

export default app;
