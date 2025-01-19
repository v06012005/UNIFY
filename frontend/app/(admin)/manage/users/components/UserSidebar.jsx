import React from 'react'
import Link from "next/link";
import UnifyLogoIcon from '@/components/global/UnifyLogoIcon';

const NavButton = React.memo(function NavButton({ iconClass, href = "", title = "", text = "" }) {

    return (
        <Link title={title}
            href={href}
            className={`w-full dark:hover:text-black dark:hover:bg-gray-200 flex h-full items-center justify-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]`}
        >
            <i className={`${iconClass} w-full`}></i> {text}
        </Link>
    )
});

const UserSidebar = () => {
    return (
        <div className="relative flex flex-row">
            <div className="flex flex-col border h-screen fixed left-20 top-0 z-50 w-52">
                <ul className="text-3xl flex flex-col justify-center grow w-full">
                    <li className="h-16">
                        <NavButton title="User Management" href="/manage/users" iconClass={"fa-solid fa-users-gear"} text="List" />
                    </li>
                    <li className="h-16">
                        <NavButton title="Post Management" href="/manage/posts" iconClass={"fa-solid fa-newspaper"} />
                    </li>
                    <li className="h-16">
                        <NavButton title="Report Management" href="/manage/reports" iconClass={"fa-solid fa-flag"} />
                    </li>
                    <li className="h-16">
                        <NavButton title="Statistics"
                            href="/manage/statistics"
                            iconClass={"fa-solid fa-chart-simple"}
                        />
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default UserSidebar