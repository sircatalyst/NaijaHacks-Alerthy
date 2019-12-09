import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';

import routes from './routes';
import swaggerDocument from './docs/swagger';

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
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// handles non-existing routes
app.all('*', (req, res) =>  res.status(404).json({error: 'route not found'}));

export default app;
