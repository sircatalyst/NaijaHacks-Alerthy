import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(logger('dev'));

app.get('/', (req, res) => res.send('Hello World!'));
app.use(routes);
// handles non-existing routes
app.all('*', (req, res) => res.status(404).json({ error: 'route not found' }));

export default app;
