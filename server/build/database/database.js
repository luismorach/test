"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require('dotenv').config();
const pool = new pg_1.Pool({
    user: process.env.USER,
    host: 'localhost',
    database: 'db_inventary',
    password: process.env.PASSWORD,
    port: 5432,
});
console.log(require('dotenv').config());
console.log(process.env.USER);
console.log(process.env.PASSWORD);
console.log(process.env.HOST);
console.log(process.env.DATABASE);
console.log("DB conected");
exports.default = pool;
