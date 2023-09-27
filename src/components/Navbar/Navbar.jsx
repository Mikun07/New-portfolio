import React, { useState } from 'react';
// import { ImHome } from 'react-icons/im';
// import { HiOutlineClipboardList } from 'react-icons/hi'
// import { RiContactsBookFill, RiUserStarLine, RiInformationLine } from 'react-icons/ri';
import { Link } from 'react-scroll';

function Navbar() {

    const [active, setActive] = useState(0);

    const links = [
        {
            id: 1,
            link: 'home',
            icon: "home-outline",
            dis: "translate-x-0",
        },
        {
            id: 2,
            link: 'about',
            icon: "information-circle-outline",
            dis: "translate-x-0",
        },
        {
            id: 3,
            link: 'experience',
            icon: "file-tray-outline",
            dis: "translate-x-16",
        },
        {
            id: 4,
            link: 'project',
            icon: "clipboard-outline",
            dis: "translate-x-32",
        },
        {
            id: 5,
            link: 'contact',
            icon: "chatbubble-ellipses-outline",
            dis: "translate-x-48",
        },
    ];
64
    return (
        <>
            <nav className='w-full h-16 z-50 fixed transition-shadow duration-400 bg-gray-200 flex justify-between text-center px-2 items-center'>
                <a href="#" className='flex text-center items-center gap-6 text-sm md:text-lg font-semibold cursor-pointer'>
                    <span className=' bg-black flex items-center text-center h-[42px] w-[42px] rounded-full text-2xl text-white  justify-center'>A</span>
                    <span>Festus-Olaleye Ayomikun Oluwasemilore</span>
                </a>
                <div>
                    <ul className='hidden sm:hidden md:hidden lg:flex gap-6 text-lg font-semibold '>
                        {links.map(({ id, link },) => (
                            <span
                                key={id}
                                className='capitalize cursor-pointer hover:scale-105 duration-200 px-4'
                            >
                                <Link to={link} smooth duration={500}>{link}</Link>
                            </span>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className='h-screen flex justify-center items-center'>
                <nav className='bg-gray-200 max-h-[5.4rem] border-4 border-gray-900 rounded-xl z-50 px-6'>
                    <ul className='flex relative'>
                        <span className={`bg-yellow-500 duration-500 ${links[active].dis} border-4 border-gray-900 h-16 w-16 absolute -top-4 rounded-full`}>
                           <span className='className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] rounded-tr-[11px] shadow-myShadow1'></span>
                           <span className='className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] rounded-tl-[11px] shadow-myShadow2'></span>
                        </span>
                        {links.map(({ id, link, icon, dis },) => (
                            <li key={id} className='w-16'>
                                <Link onClick={() => setActive(id)} to={link} smooth duration={500} className='flex flex-col text-center pt-7'>
                                    <span
                                        className={`text-xl cursor-pointer duration-500 ${id === active && "-mt-6 text-white"
                                            }`}>
                                        <ion-icon name={icon}></ion-icon>
                                    </span>
                                    <span
                                        className={` ${active === id
                                            ? "translate-y-4 duration-700 opacity-100"
                                            : "opacity-0 translate-y-10"
                                            }`}
                                    >
                                        {link}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav >
            </div>
        </>
    )
}

export default Navbar