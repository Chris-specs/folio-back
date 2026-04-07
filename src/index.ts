import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth'
import { appAuth } from './routes/auth'

const app = new Hono()

app.use(
    '*',
    cors({
        origin: process.env.TRUSTED_ORIGINS!.split(','),
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true
    })
)

app.get('/', (c) => {
    return c.json({ message: 'Folio API' })
})
app.route('/api/auth', appAuth)

app.use(authMiddleware)

serve(
    {
        fetch: app.fetch,
        port: 3001
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    }
)
