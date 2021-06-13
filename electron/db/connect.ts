import * as isDev from 'electron-is-dev';
import * as path from 'path'
// const isDevelopment = process.env.NODE_ENV === 'development';
const filePath = isDev ? path.join(__dirname, '..', '..', '..', 'electron/data/database.sqlite') : path.join(__dirname, '..', '..', '/database.sqlite');
console.log(filePath);

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: filePath
    }
});

export default knex;
