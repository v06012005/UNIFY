import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session) {
    if (!session) {
        console.log('No token found in cookies.')
        return null
    }


    console.log('SESSION_SECRET:', secretKey);
    console.log('Encoded Key:', encodedKey);


    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        console.log('Decoded JWT payload:', payload)
        return payload
    } catch (error) {
        console.log('JWT verification failed:', error)
        return null
    }
}

