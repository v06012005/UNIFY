"use client";

import React from 'react'
import Image from 'next/image'
import dummy from '@/public/images/dummy.png'
import avatar from '@/public/images/test1.png'
import Link from 'next/link'
import { useState } from 'react'
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import ShareButton from './ShareButton';
import CommentForm from './CommentForm';
import PostVideo from './PostVideo';



const User = ({ href = "" }) => {
    return (
        <Link href={href}>
            <div className="flex mb-4">
                <Image src={avatar} alt="Avatar" className="rounded-full w-14 h-14" />
                <div className="ml-5">
                    <p className="my-auto text-lg font-bold">@username</p>
                    <p className="my-auto">Johnny Dang</p>
                </div>
            </div>
        </Link>
    );
};

const Hashtag = ({ content = "", to = "" }) => {
    return (
        <Link href={to} className='text-lg text-sky-500 mr-4 hover:underline hover:decoration-sky-500'>{content}</Link>
    )
}

const Caption = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);
    return (
        <>
            <div className='my-3 leading-snug text-wrap'>
                {isExpanded ? text : `${text.slice(0, maxLength)}...`}
                <button onClick={toggleExpanded} className="text-gray-500 font-semibold ml-2">{isExpanded ? "Less" : "More"}</button>
            </div>
        </>
    )
}

const Slider = ({ srcs = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prev = () => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? srcs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const next = () => {
        const isLast = currentIndex === srcs.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goTo = (index) => {
        setCurrentIndex(index);
    }

    return (
        <div className='max-w-[450px] w-full h-[550px] bg-cover relative mx-auto group'>
            {srcs[currentIndex].type === "image" &&
                <Image src={srcs[currentIndex].url} alt='Image' className='object-cover w-full h-full rounded-lg duration-500' width={450} height={550} />
            }
            {srcs[currentIndex].type === "video" &&
                <>
                    <PostVideo src={srcs[currentIndex].url} />
                </>
            }

            <div onClick={next} className='hidden group-hover:flex absolute top-1/2 right-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer'><i className="fa-solid fa-angle-right m-auto"></i></div>
            <div onClick={prev} className='hidden group-hover:flex absolute top-1/2 left-[-10px] -translate-x-0 -translate-y-1/2 bg-gray-400 w-7 h-7 rounded-full cursor-pointer'><i className="fa-solid fa-angle-left m-auto"></i></div>
            <div className='flex justify-center'>
                {srcs.map((src, index) => (
                    <div key={index} onClick={() => goTo(index)} className={`text-xs mx-[2px] cursor-pointer ${currentIndex === index ? "text-white" : "text-gray-500"}`}><i className="fa-solid fa-circle fa-xs"></i></div>
                ))}
            </div>
        </div>
    )
}

const Post = ({ srcs }) => {
    return (
        <div className='w-3/4 mb-8 mx-auto pb-8'>
            <User href='/profile' />
            <Slider srcs={srcs} />
            {/* <Image src={imageSrc} alt='Dummy' className='w-[450px] h-[550px] mb-2 object-cover mx-auto rounded-lg' width={450} height={550} /> */}
            <Caption text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quibusdam, ex maiores amet alias dolor minima magnam quis totam molestias consectetur laudantium possimus et asperiores? Dignissimos minima animi omnis sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, id repellat minus labore esse eligendi maiores asperiores? Architecto dolorem veritatis, totam nam, molestiae quo quis asperiores qui nostrum animi possimus?`} />
            <div className='flex text-xl'>
                <LikeButton className='!text-xl' />
                <CommentButton className='text-xl'><i className="fa-regular fa-comment"></i>47K</CommentButton>
                <ShareButton />
            </div>
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
                <CommentButton className='text-black hover:text-gray-500 text-md animate-none transition-none dark:text-gray-400 dark:hover:text-white'>View all comments</CommentButton>
            </div>
            <CommentForm />
        </div>
    )
}

export default Post