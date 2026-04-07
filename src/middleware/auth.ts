import { auth as authLib } from '@/lib/auth'
import { RESPONSE_CODES } from '@/lib/constants/codes'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export type AuthVariables = {
    user: typeof authLib.$Infer.Session.user | null
    session: typeof authLib.$Infer.Session.session | null
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
    async (c, next) => {
        const session = await authLib.api.getSession({
            headers: c.req.raw.headers
        })

        if (!session) {
            c.set('user', null)
            c.set('session', null)
            throw new HTTPException(401, {
                message: RESPONSE_CODES.UNAUTHORIZED
            })
        }

        c.set('user', session.user)
        c.set('session', session.session)
        return next()
    }
)
