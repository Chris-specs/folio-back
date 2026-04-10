import { db } from '@/db'
import {
    accountsTable,
    sessionsTable,
    usersTable,
    verificationsTable
} from '@/db/schemas'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL)
console.log('TRUSTED_ORIGINS:', process.env.TRUSTED_ORIGINS!.split(','))
console.log(
    'GOOGLE_CLIENT_ID:',
    process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set'
)
console.log(
    'BETTER_AUTH_SECRET:',
    process.env.BETTER_AUTH_SECRET ? 'set' : 'not set'
)

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [process.env.BETTER_AUTH_URL!, '*.vercel.app']
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
        schema: {
            users: usersTable,
            sessions: sessionsTable,
            accounts: accountsTable,
            verifications: verificationsTable
        }
    }),
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    trustedOrigins: process.env.TRUSTED_ORIGINS!.split(','),
    advanced: {
        crossSubDomainCookies: {
            enabled: true
        },
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        }
    }
})
