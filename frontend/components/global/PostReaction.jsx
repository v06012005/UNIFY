import React from 'react'

const Reaction = ({ iconClass, quantity = 0 }) => {

    return (
        <div className='flex items-center mr-4'>
            <i className={iconClass}></i>
            <p className='ml-1'>{quantity}</p>
        </div>
    )
}

const PostReaction = () => {
    return (
        <div className='flex text-xl'>
            <Reaction iconClass={`fa-regular fa-heart`} quantity={'47K'}></Reaction>
            <Reaction iconClass={`fa-solid fa-comment`} quantity={'47K'}></Reaction>
            <Reaction iconClass={`fa-solid fa-share`} quantity={'47K'}></Reaction>
        </div>
    )
}

export default PostReaction