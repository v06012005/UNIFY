import React from 'react'
import Image from 'next/image'
import dummy from '@/public/images/dummy.png'
import avatar from '@/public/images/test1.png'
import PostReaction from './PostReaction'
import Link from 'next/link'

const User = () => {
    return (
        <div className='flex mb-2'>
            <Image src={avatar} alt='Avatar' className='rounded-full w-14 h-14' />
            <p className='my-auto ml-3 text-lg font-bold'>@username</p>
        </div>
    )
}

const Hashtag = ({ content = "", to = "" }) => {
    return (
        <Link href={to} className='text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500'>{content}</Link>
    )
}

const Post = () => {
    return (
        <div className='aspect-video mb-8 pb-8 border-b border-black'>
            <User></User>
            <p className='mb-2 leading-snug text-wrap'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam quis totam molestias consectetur laudantium possimus et asperiores? Dignissimos minima animi omnis sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?</p>
            <Image src={dummy} alt='Dummy' className='w-full mb-2 rounded-lg' width={600} height={400} />
            <PostReaction></PostReaction>
            <div className='mt-2 flex flex-wrap'>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
                <Hashtag content='#myhashtag'></Hashtag>
            </div>
            <div className='mt-2'>
                <button className='text-black hover:text-gray-500 text-md'>View all comments</button>
            </div>
            <form action="#">
                <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2">
                        <input type="text" name="comment" id="comment" className="block text-wrap min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-90 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder="Add a comment" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Post