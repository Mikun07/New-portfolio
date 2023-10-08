import React from "react";
import DP from "../../assets/img/Dp.jpg";
import CurvedArrow from "../../assets/svg/curved-arrow.svg";
import RandomLines from "../../assets/svg/random-lines.svg";

function Home() {
  
  const Social = [
    {
      id: 1,
      icon: "logo-linkedin",
      href: "https://linkedin.com",
      style: "bg-[#0077b5] h-[40px] w-[40px] md:h-[42px] md:w-[42px] lg:h-[45px] lg:w-[45px]  rounded-full text-xs md:text-lg sm:text-lg flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    },
    {
      id: 2,
      icon: "logo-github",
      href: "https://github.com/Mikun07",
      style: "bg-black h-[40px] w-[40px] md:h-[42px] md:w-[42px] lg:h-[45px] lg:w-[45px]  rounded-full text-xs md:text-lg sm:text-lg flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    },
    {
      id: 3,
      icon: "mail-outline",
      href: "mailto:ayomikunolaleye@gmail.com",
      style: "bg-[#EA4335] h-[40px] w-[40px] md:h-[42px] md:w-[42px] lg:h-[45px] lg:w-[45px] rounded-full text-xs md:text-lg sm:text-lg flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    },
    {
      id: 4,
      icon: "document-outline",
      href: "Resume",
      style: "bg-[#DD1908] h-[40px] w-[40px] md:h-[42px] md:w-[42px] lg:h-[45px] lg:w-[45px]  rounded-full text-xs md:text-lg sm:text-lg flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
      download: true,
      src: "Resume",
    },
    // {
    //   id: 5,
    //   icon: "logo-whatsapp",
    //   href: "",
    //   style: "bg-[#075E54] h-[40px] w-[40px] md:h-[42px] md:w-[42px] lg:h-[45px] lg:w-[45px]  rounded-full text-xs md:text-lg sm:text-lg flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    // },
  ];

  return (
    <>
      <div
        name="home"
        className="w-full px-4 h-screen flex bg-gray-200"
      >
        <div className="flex lg:justify-center border-2 px-4 items-center flex-col-reverse md:flew-row lg:flex-row gap-6 lg:gap-32">
          {/* info */}
          <div className=" flex flex-col gap-6 lg:gap-16">
            <div className="flex text-justify">
              <p className=" px-4 text-xs sm:text-base md:text-lg lg:text-xl">
                <b className="home__description">Frontend Developer. </b>
                Knowledgeable and adept at creating successful websites that
                meet customer needs. Specializing in collaborating with
                customers to gather requirements, produce plans and improve
                designs for usability and functionality. Fully proficient in
                HTML5, CSS3, JavaScript, and other JavaScript frameworks like
                React and Angular.
              </p>
            </div>

            <div className="flex items-start justify-center gap-4 pb-4 lg:pb-0">
              {Social.map(({ id, src, icon, href, download, style }) => (
                <button key={id} className={style}>
                  <a
                    alt={src}
                    href={href}
                    download={download}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ion-icon name={icon}></ion-icon>
                  </a>
                </button>
              ))}
            </div>
          </div>

          {/* image */}
          <div className="flex relative lg:items-center justify-center">
            <img
              src={DP}
              alt="Display picture"
              className=" z-20 w-[220px] absolute"
            />
            <div className="bg-gray-200 z-10 border-4 border-black w-[220px] lg:h-[300px] h-[280px] mt-6 ml-6"></div>

            <img
              src={CurvedArrow}
              alt=""
              className=" z-0 absolute bottom-[-55px] hidden lg:flex"
            />
            <img
              src={RandomLines}
              alt=""
              className=" z-0 absolute lg:right-[-25px] lg:top-[170px] bottom-[70px] right-[-28px]"
            />

            <div class="geometric-box z-30 absolute top-[70px] left-1"></div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;
