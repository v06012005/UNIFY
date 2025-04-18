"use client"

import { fetchSuggestedUsers, getUser } from '@/app/lib/dal'
import { Avatar, Skeleton } from '@heroui/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const User = ({
    href = "",
    username = "",
    firstname = "",
    lastname = "",
    avatar = "",
}) => (
    <Link href={href}>
        <div className="flex mb-4">
            <Avatar className="" size="lg" src={avatar} />
            <div className="ml-5">
                <p className="my-auto text-lg font-bold">@{username}</p>
                <p className="my-auto">
                    {firstname} {lastname}
                </p>
            </div>
        </div>
    </Link>
);

const SuggestedUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            const user = await getUser();
            const fetchedUsers = await fetchSuggestedUsers(user.id);
            setUsers(fetchedUsers);
            setIsLoading(false);
        }

        fetchUsers();
    }, [])

    if (loading) {
        return (
            <>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div className='flex mb-4' key={index}>
                        <Skeleton className='w-14 h-14 rounded-full'>User</Skeleton>
                        <div className='flex flex-col ml-2'>
                            <Skeleton className='h-6 rounded-md w-32'>
                                <div>@username.username</div>
                            </Skeleton>
                            <Skeleton className='h-6 mt-1 rounded-md w-40'>
                                <div>Johnny Dang</div>
                            </Skeleton>
                        </div>
                    </div>
                ))}
            </>
        );
    }


    return (
        <>
            {users.map((u) => {
                return (
                    <User key={u?.id}
                        avatar={u?.avatar?.url}
                        href={`/othersProfile/${u?.username}`}
                        username={u?.username}
                        firstname={u?.firstName}
                        lastname={u?.lastName}
                    />
                )
            })}
        </>
    )
}

export default SuggestedUsers