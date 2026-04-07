import { auth } from '@/lib/auth'
import { Hono } from 'hono'

const appAuth = new Hono()

appAuth.on(['POST', 'GET'], '*', (c) => {
    return auth.handler(c.req.raw)
})

export { appAuth }
