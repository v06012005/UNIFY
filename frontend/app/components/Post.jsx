import React from 'react'
import Image from 'next/image'
import dummy from '@/public/images/dummy.png'
import PostReaction from './PostReaction'

const Post = () => {
    return (
        <div className=''>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?</p>
            <Image src={dummy} alt='Dummy' width={600} height={400} />
            <PostReaction></PostReaction>
        </div>
    )
}

export default Post