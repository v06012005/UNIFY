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
    const token = (await cookies()).get('token')?.value

    try {
        const response = await fetch("http://localhost:8080/users/my-info", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log('Failed to fetch user')
            return null;
        }

        const user = await response.json();

        return user
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})