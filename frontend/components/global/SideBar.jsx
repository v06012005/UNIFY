import Image from 'next/image'
import React from 'react'
import Link from 'next/link'


const NavButton = ({ iconClass, href = "" }) => {
    return (
        <Link className='w-full flex h-full items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]' href={href}>
            <i className={`${iconClass} w-full`}></i>
        </Link>
    )
}

const SideBar = () => {
    return (
        <div className='flex flex-col border h-screen fixed left-0 top-0'>
            <Image src={`/images/unify_icon_lightmode.svg`} alt='UNIFY logo' width={100} height={100} className='mx-auto flex-none h-20 w-20'></Image>
            <ul className='text-3xl flex flex-col justify-center grow w-full'>
                <li className='h-16'>
                    <NavButton href='/' iconClass={"fa-solid fa-house"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/' iconClass={"fa-solid fa-magnifying-glass"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/explore' iconClass={"fa-solid fa-compass"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/reels' iconClass={"fa-solid fa-film"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/messages' iconClass={"fa-brands fa-facebook-messenger"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/notifications' iconClass={"fa-solid fa-bell"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/posts' iconClass={"fa-regular fa-square-plus"}></NavButton>
                </li>
            </ul>
            <Link className='w-20 flex h-20 text-3xl items-center text-center transition delay-100 ease-in-out duration-100 hover:bg-[#D9D9D9]' href={""}>
                <i className={`fa-solid w-full fa-gear`}></i>
            </Link>
        </div>
    )
}

export default SideBar