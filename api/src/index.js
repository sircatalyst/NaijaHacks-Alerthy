import app from './createServer';
import { PORT } from './config/constants';
import { sequelize } from './models';

const port = PORT || 3001;
// Test DB Connection
sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const models = {
  User: sequelize.import('./models/user.js')
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default models;
