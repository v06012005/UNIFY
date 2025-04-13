"use client"
import { Card, CardBody, CardHeader, Skeleton, User } from '@heroui/react'
import React from 'react'

const MyHeading2 = ({ content = "Heading 2" }) => {
    return (
        <h2 className="font-bold text-2xl my-4">{content}</h2>
    )
}

const ReportedPostLoading = () => {
    return (
        <>
            <div className="border p-3 bg-gray-100 my-3 rounded-md">
                <MyHeading2 content="Basic Info" />
                <div className="w-3/4 pl-5">
                    <ul>
                        <li><div className='font-bold flex'>Reported Date: <Skeleton className='h-5 ml-2 rounded-md'>Mar 28, 2025, 12:00 PM</Skeleton></div></li>
                        <li>
                            <div className="font-bold flex">
                                Status: <Skeleton className='p-1  h-5 ml-2 rounded-md'>Pending</Skeleton>
                            </div>
                        </li>
                        <li><div className="font-bold flex">Reporter's ID: <Skeleton className="p-1  h-5 ml-2 rounded-md">6092c189-e24a-451f-9da7-b25d8e2605f1</Skeleton></div></li>
                        <li><div className="font-bold flex">Reported Post's ID: <Skeleton className="p-1  h-5 ml-2 rounded-md">6092c189-e24a-451f-9da7-b25d8e2605f1</Skeleton></div></li>
                    </ul>
                </div>
                <div className="flex w-3/4 pl-5 my-4 ">
                    <Card className="py-2 shadow-none border rounded-md w-1/3">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h4 className="font-bold text-large">Reporter</h4>
                        </CardHeader>
                        <Skeleton className='rounded-md mx-3'>
                            <CardBody className="overflow-visible">
                                <User
                                    avatarProps={{
                                        src: `${""}`,
                                    }}
                                    description={`mattle1@gmail.com`}
                                    name={`Matt Le`} className="my-3 justify-start"
                                />
                            </CardBody>
                        </Skeleton>
                    </Card>
                    <div className="flex mx-5">
                        <i className="fa-regular my-auto fa-circle-right text-4xl"></i>
                    </div>

                    <Card className="py-2 shadow-none border rounded-md w-1/3">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h4 className="font-bold text-large text-red-500">Reported Post Owner</h4>
                        </CardHeader>
                        <Skeleton className='rounded-md mx-3'>
                            <CardBody className="overflow-visible">
                                <User
                                    avatarProps={{
                                        src: `${""}`,
                                    }}
                                    description={`mattle1@gmail.com`}
                                    name={`Matt Le`} className="my-3 justify-start"
                                />
                            </CardBody>
                        </Skeleton>

                    </Card>
                </div>
            </div>
            <div className="border p-3 bg-gray-100 my-3 rounded-md">
                <MyHeading2 content="Reported Reason" />
                <Skeleton className='rounded-md ml-5'>
                    <div className="w-full pl-5 max-h-52 overflow-y-auto">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam totam cupiditate recusandae similique officia explicabo possimus perferendis sunt, quam quibusdam accusantium expedita est odit magni fugiat iste fuga quas atque.
                    </div>
                </Skeleton>
            </div>
            <div className="border p-3 bg-gray-100 my-3 rounded-md">
                <MyHeading2 content="Post Details" />
                <div className="w-full pb-5 pl-5">
                    <div className="flex flex-col md:flex-row">
                        <Skeleton className='rounded-md w-1/3'>
                            <div className="w-1/3 md:w-1/2 mb-6 md:mb-0 md:mr-6">
                                <div className="border rounded-md flex h-32 cursor-pointer select-none">
                                    <i className="fa-solid fa-photo-film fa-2xl m-auto"> Media</i>
                                </div>
                            </div>
                        </Skeleton>

                        <Skeleton className='rounded-md w-2/3 ml-5'>
                            <div className="w-full md:w-2/3 bg-zinc-100 p-2 rounded-lg">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam iusto mollitia fugit. Officia facilis accusantium maxime repudiandae, praesentium, animi id doloremque illo cum adipisci illum tempore impedit officiis necessitatibus vel.
                            </div>
                        </Skeleton>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ReportedPostLoading