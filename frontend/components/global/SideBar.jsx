import Image from 'next/image'
import React from 'react'
import Link from 'next/link'


const NavButton = ({ iconClass, href = "" }) => {
    return (
        <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={href}>
            <i className={`${iconClass} w-full`}></i>
        </Link>
    )
}

const SideBar = () => {
    return (
        <div className='flex flex-col h-screen fixed left-0 top-0'>
            <Image src={`/images/unify_icon_lightmode.svg`} alt='UNIFY logo' width={100} height={100} className='mx-auto basis-1/4'></Image>
            <ul className='text-3xl w-full basis-1/2'>
                <li className='h-16'>
                    <NavButton iconClass={"fa-solid fa-house"}></NavButton>
                </li>
                <li className='h-16'>
                    <NavButton iconClass={"fa-solid fa-magnifying-glass"}></NavButton>
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
            </ul>
            <Link className='w-full basis-1/4 flex h-16 text-3xl items-end pb-8 text-center' href={""}>
                <i className="fa-solid w-full fa-gear"></i>
            </Link>
        </div>
    )
}

export default SideBar