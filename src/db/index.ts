import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schemas'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!
})

pool.on('connect', (client) => {
    client.query("SET timezone = 'UTC'")
})

export const db = drizzle({ client: pool, schema })
