import { db } from '@/db'
import {
    accountsTable,
    sessionsTable,
    usersTable,
    verificationsTable
} from '@/db/schemas'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
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
        defaultCookieAttributes: {
            domain:
                process.env.NODE_ENV === 'production'
                    ? 'christiansan.com'
                    : undefined
        }
    }
})
