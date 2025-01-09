import React from 'react'
import Image from 'next/image'
import dummy from '@/public/images/dummy.png'
import avatar from '@/public/images/test1.png'
import PostReaction from './PostReaction'

const User = () => {
    return (
        <div className='flex mb-2'>
            <Image src={avatar} alt='Avatar' className='rounded-full w-14 h-14' />
            <p className='my-auto ml-3 text-lg font-bold'>@username</p>
        </div>
    )
}

const Post = () => {
    return (
        <div className='aspect-video mb-8 pb-8 border-b border-black'>
            <User></User>
            <p className='mb-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?</p>
            <Image src={dummy} alt='Dummy' className='w-full mb-2 rounded-lg' width={600} height={400} />
            <PostReaction></PostReaction>
        </div>
    )
}

export default Post