import { serve } from '@hono/node-server'
import { APIError } from 'better-auth/api'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { auth } from './middleware/auth'
import { logger } from './middleware/logger'
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

app.use(logger)
app.get('/', (c) => {
    return c.json({ message: 'Folio API' })
})
app.route('/api/auth', appAuth)

app.use(auth)

app.onError((err, c) => {
    console.log('Error: ', err)
    if (err instanceof HTTPException) {
        return c.json(
            {
                code: (err as unknown as { cause?: unknown }).cause,
                message: err.message
            },
            err.status
        )
    }

    if (err instanceof APIError) {
        return c.json(
            {
                message: err.message,
                details: err
            },
            (err as unknown as { statusCode: number })
                .statusCode as ContentfulStatusCode
        )
    }

    return c.json(
        {
            message: 'Internal server error',
            details: JSON.stringify(err, null, 2)
        },
        500
    )
})

app.notFound((c) => {
    return c.json(
        {
            message: 'Route not found'
        },
        404
    )
})

serve(
    {
        fetch: app.fetch,
        port: 3001
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
    }
)
