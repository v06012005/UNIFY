import React from 'react'
import Link from "next/link";
import UnifyLogo from './FullUnifyLogo';
import ModeSwitch from './ModeSwitch';
import { Accordion, AccordionItem } from "@heroui/react";


const NavButton = React.memo(function NavButton({ iconClass, href = "", title = "", text = "" }) {

    return (
        <Link title={title}
            href={href}
            className={`w-full  hover:text-white px-2 dark:hover:bg-gray-600 hover:bg-gray-500 rounded-md flex h-10 items-center text-center transition delay-100 ease-in-out duration-150`}
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
                        <AccordionItem key="1" title="User Management" className='dark:bg-gray-700' startContent={<i className='fa-solid fa-users-gear'></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="User List" href="/manage/users/list" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Admin List" href="/manage/users/list" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem className='dark:bg-gray-700' key="2" title="Post Management" startContent={<i className="fa-solid fa-newspaper"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Post List" href="/manage/posts/list" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem className='dark:bg-gray-700' key="3" title="Reports" startContent={<i className="fa-solid fa-flag"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-file-pen" text="Verify Reports" href="/manage/reports/verify" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-regular fa-rectangle-list" text="Processed Reports" href="/manage/reports/processed-reports" />
                                </li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem className='dark:bg-gray-700' key="4" title="Statistics" startContent={<i className="fa-solid fa-chart-simple"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-user" text="User Stats" href="/statistics/users" />
                                </li>
                                {/* <li>
                                    <NavButton iconClass="fa-solid fa-newspaper" text="Post Stats" href="/statistics/posts" />
                                </li> */}
                            </ul>
                        </AccordionItem>
                        {/* <AccordionItem className='dark:bg-gray-700' key="5" title="Notifications" startContent={<i className="fa-solid fa-bell"></i>}>
                            <ul>
                                <li>
                                    <NavButton iconClass="fa-solid fa-clock-rotate-left" text="All Notifications" href="/manage/notifications/list" />
                                </li>
                                <li>
                                    <NavButton iconClass="fa-solid fa-arrow-up-from-bracket" text="Push A Notification" href="/manage/notifications/add" />
                                </li>
                            </ul>
                        </AccordionItem> */}
                        <AccordionItem className='dark:bg-gray-700' key="6" title="Quick Settings" startContent={<i className="fa-solid fa-gear"></i>}>
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