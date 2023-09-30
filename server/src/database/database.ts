import { Pool} from 'pg'
 require ('dotenv').config()
const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: 'db_inventary',
  password: process.env.PASSWORD,
  port: 5432,
})
console.log(require ('dotenv').config())
console.log(process.env.USER)
console.log(process.env.PASSWORD)
console.log(process.env.HOST)
console.log(process.env.DATABASE) 
console.log("DB conected")
export default pool;  