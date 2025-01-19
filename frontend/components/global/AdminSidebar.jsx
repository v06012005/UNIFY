import React from 'react'
import Link from "next/link";
import UnifyLogo from './FullUnifyLogo';
import ModeSwitch from './ModeSwitch';
import { Accordion, AccordionItem } from "@heroui/react";


const NavButton = React.memo(function NavButton({ iconClass, href = "", title = "", text = "" }) {

    return (
        <Link title={title}
            href={href}
            className={`w-full dark:hover:text-black hover:text-white px-2 hover:bg-gray-500 rounded-md flex h-10 items-center text-center transition delay-100 ease-in-out duration-150`}
        ><i className={`${iconClass} w-1/5 text-center`}></i> {text}
        </Link>
    )
});

const AdminSidebar = () => {

    return (
        <div className="relative flex flex-row">
            <div className="flex flex-col border h-screen fixed left-0 top-0 z-50">
                <UnifyLogo className='w-52 mx-auto' />
                <div className="flex flex-col justify-center grow w-60">

                    <Accordion variant="splitted">
                        <AccordionItem key="1" title="User Management" startContent={<i className='fa-solid fa-users-gear'></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="User List" href="/manage/users" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Admin List" href="/manage/users" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem key="2" title="Post Management" startContent={<i className="fa-solid fa-newspaper"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Post List" href="/manage/posts" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem key="3" title="Reports" startContent={<i className="fa-solid fa-flag"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-file-pen" text="Verify Reports" href="/manage/users" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Processed Reports" href="/manage/users" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem key="4" title="Statistics" startContent={<i className="fa-solid fa-chart-simple"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-user" text="User Stats" href="/manage/users" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-solid fa-newspaper" text="Post Stats" href="/manage/users" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem key="5" title="Notifications" startContent={<i className="fa-solid fa-bell"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-clock-rotate-left" text="All Notifications" href="/manage/users" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-solid fa-arrow-up-from-bracket" text="Push A Notification" href="/manage/users" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem key="6" title="Quick Settings" startContent={<i className="fa-solid fa-gear"></i>}>
                            <ul>
                                <li className='pl-4'>
                                    <ModeSwitch text='Dark Mode' className='' />
                                </li>
                            </ul>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

        </div>
    )
}

export default AdminSidebar