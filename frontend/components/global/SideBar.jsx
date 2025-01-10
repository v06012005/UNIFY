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
            <Image src={`/images/unify_icon_lightmode.svg`} alt='UNIFY logo' width={100} height={100} className='mx-auto'></Image>
            <ul className='text-3xl w-full'>
                <li className='h-16'>
                    <NavButton href='/' iconClass={"fa-solid fa-house"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/' iconClass={"fa-solid fa-magnifying-glass"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton href='/' iconClass={"fa-solid fa-compass"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-solid fa-film"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-brands fa-facebook-messenger"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-solid fa-bell"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-regular fa-square-plus"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-solid w-full fa-gear"}></NavButton>
                </li>
            </ul>
        </div>
    )
}

export default SideBar