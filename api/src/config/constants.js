const dotenv = require('dotenv');

dotenv.config();
const { DB_USER, DB_PASS, DB_NAME, DB_HOST, PORT } = process.env;

module.exports = { DB_USER, DB_PASS, DB_NAME, DB_HOST, PORT };

