import React, { useState } from "react";
import { Link } from "react-scroll";

function Navbar() {
  const [active, setActive] = useState(0);
  const [nav, setNav] = useState(false);

  const links = [
    {
      id: 1,
      link: "home",
      icon: "home-outline",
    },
    {
      id: 2,
      link: "about",
      icon: "information-circle-outline",
    },
    {
      id: 3,
      link: "services",
      icon: "terminal-outline",
    },
    {
      id: 4,
      link: "project",
      icon: "folder-open-outline",
    },
    {
      id: 5,
      link: "contact",
      icon: "chatbubble-ellipses-outline",
    },
  ];
  64;
  return (
    <>
      <nav className="w-full h-16 fixed z-50 transition-shadow duration-400 bg-gray-200 flex justify-between text-center px-4 items-center shadow-lg">
        <Link
          to="home"
          smooth
          duration={700}
          className="flex text-center items-center gap-2 font-semibold cursor-pointer"
        >
          <span className=" bg-black flex items-center text-center h-[40px] w-[40px] rounded-full text-lg  text-white justify-center cursor-pointer">
            A
          </span>
          <span className="text-sm cursor-pointer">
            Festus-Olaleye Ayomikun Oluwasemilore
          </span>
        </Link>

        <div>
          <ul className="hidden sm:hidden md:hidden lg:flex gap-4 text-lg font-semibold ">
            {links.map(({ id, link }) => (
              <span
                key={id}
                className={`capitalize cursor-pointer hover:scale-105 duration-200 px-2`}
              >
                <Link to={link} smooth duration={700}>
                  {link}
                </Link>
              </span>
            ))}
          </ul>
        </div>

        <div className=" lg:hidden flex">
          <button
            onClick={() => setNav(!nav)}
            className=" bg-transparent border-2 border-black shadow-md shadow-gray-200 h-[40px] w-[40px] text-lg rounded-md flex items-center text-black justify-center cursor-pointer hover:scale-105 duration-200"
          >
            <ion-icon name="list-outline"></ion-icon>
          </button>
        </div>

        {nav && (
          <ul className="absolute top-0 right-0 w-[70%] h-screen bg-gray-200">
            <div className="mt-6 px-3 ">
              <span className="flex text-center items-center justify-between font-semibold cursor-pointer">
                <span className="text-xs cursor-pointer">
                  Festus-Olaleye Ayomikun Oluwasemilore
                </span>
                <button
                  onClick={() => setNav(!nav)}
                  className=" bg-transparent border-2 border-black shadow-md shadow-gray-200 h-[40px] w-[40px] text-2xl rounded-md flex items-center text-black justify-center cursor-pointer hover:scale-105 duration-200"
                >
                  <ion-icon name="close"></ion-icon>
                </button>
              </span>
            </div>
            {links.map(({ id, link, icon }) => (
              <li key={id} className="flex px-11 my-6 hover:bg-black w-full hover:text-white hover:border-l-orange-500 hover:border-l-4">
                <Link
                  onClick={() => setNav(!nav)}
                  to={link}
                  smooth
                  duration={500}
                  className="flex capitalize p-4 gap-8 font-bold justify-center items-center text-center"
                >
                  <ion-icon name={icon} size="large"></ion-icon>
                  <h3>{link}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}

export default Navbar;
