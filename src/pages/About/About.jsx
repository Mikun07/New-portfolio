import React from "react";
import AP from "../../assets/img/Ap.jpg";
import RandomLines from "../../assets/svg/random-lines.svg";
function About() {
  return (
    <>
      <div name="about" className="h-screen lg:pt-0 md:pt-[250px] sm:pt-[250px] pt-[400px] px-4 flex items-center justify-center bg-gray-200">
        <div className="flex flex-col">
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>about me.</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* image */}
            <div className=" flex justify-center">
              <div className="flex relative">
                <img
                  src={AP}
                  alt="Display picture"
                  className="z-30 w-[215px] top-[50px] border-4 border-white absolute"
                />
                <img
                  src={RandomLines}
                  alt="random-line"
                  className=" z-20 absolute left-[185px] top-[100px]"
                />
                <div className=" w-[50px] z-20 h-[50px] bg-orange-500 absolute left-[170px] top-[250px]"></div>
                <div className="bg-gray-300 z-10 ml-[90px] w-[180px] h-[350px]"></div>
                <div className="bg-orange-500 z-0 ml-[90px] mt-1 w-[180px] h-[350px] absolute"></div>
                <div className="geometric-box z-30 absolute top-5 left-[230px]"></div>
              </div>
            </div>

            {/* info */}
            <div className=" flex justify-center flex-col gap-6">
              <div className="flex text-justify flex-col gap-6">
                <ul className="list-disc list-inside flex flex-col gap-6">
                  <li>
                    Passionate about creating{" "}
                    <span className="capitalize font-bold">web pages</span> with{" "}
                    <span className="capitalize font-bold">
                      UI/UX user interface
                    </span>{" "}
                    that meet customer needs. I Specialize in collaborating with customers to gather requirements, produce plans and improve designs for usability and functionality.
                  </li>
                  <li>
                    <span className="capitalize font-bold">My Skills are:</span>{" "}
                    Frontend Development, Web Development, HTML, CSS,
                    JavaScript. React, Angular, Bootstrap, Tailwind CSS. Rest
                    API, Microsoft SQL Server, Java, Git & GitHub.
                  </li>
                </ul>

                <div className=" flex justify-center items-center gap-6">
                  <button className="bg-black p-4 text-white flex items-center capitalize gap-1 text-center hover:bg-orange-500 rounded-sm text-base">
                    <span>
                      <ion-icon name="paper-plane-outline"></ion-icon>
                    </span>
                    Contact me
                  </button>
                  <button className=" bg-transparent border-2 border-black hover:border-orange-500 hover:text-orange-500 p-4 items-center text-center rounded-sm text-base">
                    <ion-icon name="logo-linkedin"></ion-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
