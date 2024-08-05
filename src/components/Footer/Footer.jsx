import React from "react";

function Footer() {
  return (
    <>
      <footer className="h-full px-4 flex items-center justify-center text-white bg-black">
        <div className=" grid grid-cols-1 gap-3 py-6">
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
