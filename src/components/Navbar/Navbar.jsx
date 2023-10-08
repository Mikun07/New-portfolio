import React, { useState } from 'react';
import { Link } from 'react-scroll';
import IconBtn from '../Button/IconBtn';

function Navbar() {

    const [active, setActive] = useState(0);

    const links = [
        {
            id: 1,
            link: 'home',
            icon: "home-outline",
        },
        {
            id: 4,
            link: 'project',
            icon: "folder-open-outline",
        },
        {
            id: 3,
            link: 'experience',
            icon: "clipboard-outline",
        },
        {
            id: 2,
            link: 'about',
            icon: "information-circle-outline",
        },
        {
            id: 5,
            link: 'contact',
            icon: "chatbubble-ellipses-outline",
        },
    ];
64
    return (
        <>
            <nav className='w-full h-16 z-50 fixed transition-shadow duration-400 bg-gray-200 flex justify-between text-center px-4 items-center shadow-lg'>
                <a href="#" className='flex text-center items-center gap-2 font-semibold cursor-pointer'>
                    <span className=' bg-black flex items-center text-center h-[30px] w-[30px] md:h-[42px] md:w-[42px] rounded-full text-xs md:text-lg sm:text-lg text-white justify-center cursor-pointer'>A</span>
                    <span className='text-sm cursor-pointer'>Festus-Olaleye Ayomikun Oluwasemilore</span>
                </a>

                <div>
                    <ul className='hidden sm:hidden md:hidden lg:flex gap-6 text-lg font-semibold '>
                        {links.map(({ id, link },) => (
                            <span
                                key={id}
                                className={`capitalize cursor-pointer hover:scale-105 duration-200 px-4 ${active === id ? " active:text-yellow-500" : " text-black"}`}
                            >
                                <Link to={link} smooth duration={500}>{link}</Link>
                            </span>
                        ))}
                    </ul>
                </div>

                <div>
                    <IconBtn Icon="sunny-outline"/>
                </div>
            </nav>

            {/* <div className='h-screen flex justify-center pt-[569px] md:pt-[549px] sm:pt-[549px] lg:hidden'>
                <nav className='bg-gray-200 max-h-[4.0rem] border-2 shadow-xl rounded-lg z-50'>
                    <ul className='flex relative text-center items-center'>
                        {links.map(({ id, link, icon },) => (
                            <li key={id} className={`w-16 py-2 ${active === id ? " border-yellow-500 border-b-2 rounded-xs active:transform scale-100 " : " flex justify-center" }`}>
                                <Link onClick={() => setActive(id)} to={link} smooth duration={500} className='flex flex-col'>
                                    <span
                                        className={` text-lg`}>
                                        <ion-icon name={icon}></ion-icon>
                                    </span>
                                    <span className="text-xs capitalize">
                                        {link}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav >
            </div> */}
        </>
    )
}

export default Navbar