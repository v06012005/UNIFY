import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('token')?.value
    const session = await decrypt(cookie)

    if (!session || !session?.sub) {
        return null;
    }

    return { isAuth: true, sub: session.sub }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const response = await fetch("http://localhost:8080/users/my-info");

        if (!response.ok) {
            console.log('Failed to fetch user')
            return null
        }

        const user = response.json();

        return user
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})