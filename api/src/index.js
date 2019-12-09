import app from './createServer';
import { PORT } from './config/constants';
import { sequelize } from './models';

const port = PORT || 3000;
// Test DB Connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
