import { Skeleton, User } from '@heroui/react'
import React from 'react'

const PostLoading = () => {
    return (
        <div className="w-3/4 mx-auto mt-2 opacity-10">
            <div className='flex'>
                <Skeleton className='w-14 h-14 rounded-full'>User</Skeleton>
                <div className='flex flex-col ml-2'>
                    <Skeleton className='h-6 rounded-md'>
                        <div>@username.username</div>
                    </Skeleton>
                    <Skeleton className='h-6 mt-1 rounded-md'>
                        <div>Johnny Dang</div>
                    </Skeleton>
                </div>
            </div>
            <Skeleton className='mx-auto my-2 w-[450px] rounded-lg'>
                <div className='h-[400px]'>Images/ Videos</div>
            </Skeleton>
            <Skeleton className='mt-1 w-[450px] mx-auto rounded-md'>
                <div>Captions</div>
            </Skeleton>

            <Skeleton className='mt-1 w-[450px] mx-auto rounded-md'>
                <div className="flex flex-col text-xl">
                    <div className="flex gap-2">
                        Three buttons
                    </div>

                    <div>
                        <span className="text-base text-zinc-400">0 likes</span>
                    </div>
                </div>
            </Skeleton>

            <Skeleton className="mt-1 w-[450px] mx-auto flex flex-wrap rounded-md">
                <div>Hashtag</div>
            </Skeleton>
            <Skeleton className="mt-1 w-[450px] mx-auto rounded-md">
                <div
                    className="text-black hover:text-gray-500 text-md animate-none transition-none dark:text-zinc-400 dark:hover:text-white"
                >
                    View all comments
                </div>
            </Skeleton>
        </div>
    )
}

export default PostLoading