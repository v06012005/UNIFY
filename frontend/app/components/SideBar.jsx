import Image from 'next/image'
import React from 'react'
import Link from 'next/link'


const SideBar = () => {
    return (
        <div className='border-r flex flex-col border-black h-screen w-28'>
            <Image src={`/images/unify_icon_lightmode.svg`} alt='UNIFY logo' width={100} height={100} className='mx-auto basis-1/4'></Image>
            <ul className='text-3xl w-full basis-1/2'>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i className="fa-solid w-full fa-house"></i>
                    </Link>
                </li>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i class="fa-solid w-full fa-magnifying-glass"></i>
                    </Link>
                </li>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i class="fa-solid fa-film w-full"></i>
                    </Link>
                </li>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i class="fa-brands w-full fa-facebook-messenger"></i>
                    </Link>
                </li>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i class="fa-solid fa-bell w-full"></i>
                    </Link>
                </li>
                <li className='h-16'>
                    <Link className='w-full flex h-full items-center text-center hover:bg-[#D9D9D9]' href={""}>
                        <i class="fa-regular w-full fa-square-plus"></i>
                    </Link>
                </li>
                <li className='h-16'>

                </li>
            </ul>
            <Link className='w-full basis-1/4 flex h-16 text-3xl items-center text-center hover:bg-[#D9D9D9]' href={""}>
                <i class="fa-solid w-full fa-gear"></i>
            </Link>
        </div>
    )
}

export default SideBar