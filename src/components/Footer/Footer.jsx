import React from "react";

function Footer() {
  return (
    <>
      <footer className="h-full px-4 flex items-center justify-center text-white bg-black">
        <div className=" grid grid-cols-1 gap-3 py-6">
          <ul className="flex cursor-pointer justify-center gap-4 text-gray-300">
            <li>
              <a
                href="#about"
                className="capitalize text-base leading-4 font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="capitalize text-base leading-4 font-medium"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#project"
                className="capitalize text-base leading-4 font-medium"
              >
                Projects
              </a>
            </li>
          </ul>

          <span className="capitalize font-medium text-gray-300">
            &#169; all rights reserved by{" "}
            <a href="" className=" text-white capitalize font-bold">
              Festus-Olaleye Ayomikun Oluwasemilore
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}

export default Footer;
