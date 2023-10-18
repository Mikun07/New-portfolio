import React from "react";

function Social() {
  const links = [
    {
      id: 1,
      child: (
        <>
          LinkedIn <ion-icon name="logo-linkedin" size='large'></ion-icon>
        </>
      ),
      href: "https://www.linkedin.com/in/ayomikun-festus-olaleye-bab137249?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2LsXSs0oSyykPYUHzKAwlw%3D%3D",
      className: "flex justify-between items-center w-40 h-14 px-4 font-bold bg-[#0077b5] ml-[-100px] rounded-tr-md hover:ml-[-10px] hover:rounded-md duration-300"
    },
    {
      id: 2,
      child: (
        <>
          Github <ion-icon name="logo-github" size='large'></ion-icon>
        </>
      ),
      href: "https://github.com/Mikun07",
      className: "flex justify-between items-center w-40 h-14 px-4 font-bold bg-black ml-[-100px] hover:ml-[-10px] hover:rounded-md duration-300"
    },
    {
      id: 3,
      child: (
        <>
          Resume <ion-icon name="document-text-outline" size='large'></ion-icon>
        </>
      ),
      href: "Resume.pdf",
      download: true,
      className: "flex justify-between items-center w-40 h-14 px-4 font-bold bg-[#DD1908] rounded-br-md ml-[-100px] hover:ml-[-10px] hover:rounded-md duration-300"
    },
  ];
  return (
    <div className="hidden lg:flex flex-col top-[30%] left-0 fixed z-40">
      <ul>
        {links.map(({ id, child, href, download, className}) => (
          <li
            key={id}
            className={className}
          >
            <a
              href={href}
              className="flex justify-between items-center w-full text-white"
              download={download}
              target="_blank"
              rel="noreferrer"
            >
              {child}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Social;
