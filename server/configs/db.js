import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const sql = (strings, ...values) => {
  const query = strings.reduce((acc, str, i) => acc + str + (values[i] !== undefined ? `$${i + 1}` : ''), '')
  return pool.query(query, values)
}

export default sql