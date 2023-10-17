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
      style:
        "bg-[#0077b5] h-[50px] w-[50px] text-lg rounded-md flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    },
    {
      id: 2,
      icon: "logo-github",
      href: "https://github.com/Mikun07",
      style:
        "bg-black h-[40px] h-[50px] w-[50px] text-lg rounded-md flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    },
    // {
    //   id: 3,
    //   icon: "mail-outline",
    //   href: "mailto:ayomikunolaleye@gmail.com",
    //   style:
    //     "bg-[#EA4335] h-[50px] w-[50px] text-lg rounded-md flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    // },
    {
      id: 3,
      icon: "document-text-outline",
      href: "Resume.pdf",
      style:
        "bg-[#DD1908] h-[50px] w-[50px] text-lg rounded-md flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
      download: true,
      src: "Resume.pdf",
    },
    // {
    //   id: 5,
    //   icon: "logo-whatsapp",
    //   href: "",
    //   style: "bg-[#075E54] h-[50px] w-[50px] text-lg rounded-md flex items-center text-white justify-center cursor-pointer hover:scale-105 duration-200",
    // },
  ];

  return (
    <>
      <div name="home" className="h-screen lg:pt-0 md:pt-[100px] sm:pt-[90px] pt-[90px] lg:px-20 px-4 flex items-center bg-gray-200">
        <div className="flex border-2 flex-col-reverse lg:flex-row gap-6">
          {/* info */}
          <div className=" flex justify-center flex-col gap-6">
            <div className="flex text-justify flex-col gap-6">
              <p>
                <b className="home__description">Frontend Developer. </b>
                Knowledgeable and adept at creating successful websites that
                meet customer needs. Specializing in collaborating with
                customers to gather requirements, produce plans and improve
                designs for usability and functionality. Fully proficient in
                HTML5, CSS3, JavaScript, and other JavaScript frameworks like
                React and Angular.
              </p>
            </div>

            <div className="flex items-start justify-center gap-4 lg:hidden pb-4 lg:pb-0">
              {Social.map(({ id, src, icon, href, download, style }) => (
                <button key={id} className={style}>
                  <a
                    alt={src}
                    href={href}
                    download={download}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ion-icon name={icon} ></ion-icon>
                  </a>
                </button>
              ))}
            </div>
          </div>

          {/* image */}
          <div className="flex justify-center">
            <div className=" flex relative">
              <img
                src={DP}
                alt="Display picture"
                className=" z-20 w-[220px] absolute"
              />
              <div className="bg-gray-200 z-10 border-4 border-black w-[220px] h-[300px] mt-2 ml-4"></div>

              <img
                src={CurvedArrow}
                alt=""
                className="z-0 absolute bottom-[-50px] left-24 hidden lg:flex"
              />
              <img
                src={RandomLines}
                alt=""
                className=" z-0 absolute right-[-15px] top-[90px] bottom-[70px]"
              />

              <div className="geometric-box z-30 absolute top-[70px]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
