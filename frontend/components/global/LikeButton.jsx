import React, { useState } from 'react'

const LikeButton = () => {
    const [liked, setLiked] = useState(false);

    const handleClick = () => {
        setLiked(!liked)
    }

    return (
        <div className='flex items-center mr-4'>
            <i onClick={handleClick} className={`${liked ? "fa-solid text-red-500" : "fa-regular"} fa-heart cursor-pointer transition ease-in-out duration-300`}></i>
            <p className='ml-1'>47K</p>
        </div>
    )
}

export default LikeButton