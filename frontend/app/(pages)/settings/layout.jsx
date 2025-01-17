"use client";

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NavButton = ({ iconClass, href = "", content = "" }) => {
    const pathname = usePathname();

    return (
        <Link className={clsx("flex h-full items-center text-center py-2 px-4 rounded-lg hover:bg-gray-400 bg-gray-200 transition-colors w-full",
            { "bg-gray-500 text-white hover:text-black": pathname === href })} href={href}>
            <i className={`${iconClass} mr-3`}></i>
            <span className="">{content}</span>
        </Link>
    );
};

const Title = ({ content = "" }) => {
    return (
        <p className="my-3 text-gray-500">{content}</p>
    )
}

const layout = ({ children }) => {

    return (
        <div className='flex w-full'>
            <div className="flex basis-1/4 flex-col border-r w-[300px] h-screen overflow-y-auto">
                <div className="p-3">
                    <h3 className="text-3xl font-bold ">Settings</h3>
                    <Title content='Your account' />
                    <ul className="text-1xl ">
                        <li className="h-10 flex items-center">
                            <NavButton
                                href="/settings/edit-profile"
                                iconClass="fa-solid fa-address-card"
                                content="Edit Profile"
                            />
                        </li>
                    </ul>
                    <Title content='General settings' />
                    <ul className="text-1xl ">
                        <li className="h-10 flex items-center">
                            <NavButton
                                href="/settings/preferences"
                                iconClass="fa-brands fa-gratipay"
                                content="Preferences"
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="h-screen basis-3/4">
                {children}
            </div>
        </div>
    )
}

export default layout