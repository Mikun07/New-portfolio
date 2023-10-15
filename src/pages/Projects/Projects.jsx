import React from "react";
import Project1 from "../../assets/img/project-1.jpg";
import Project2 from "../../assets/img/project-2.jpg";
import Project3 from "../../assets/img/project-3.jpg";

function Projects() {
  return (
    <>
      <div
        name="project"
        className="lg:h-screen lg:pt-0 md:pt-[550px] sm:pt-[550px] pt-[450px] px-4 flex items-center justify-center bg-gray-200"
      >
        <div className="flex flex-col">
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>Projects.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">

            <article className="px-6 py-4 flex flex-col gap-4 bg-white rounded-lg">
              <div className="relative overflow-hidden group">
                <img src={Project1} alt="" className=" w-full" />
                <div className=" absolute w-full h-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="cursor-pointer text-orange-500 bg-transparent w-[50px] h-[50px] border-2 border-orange-500 rounded-full">
                    <a href="https://github.com/Mikun07/Movie-Recommendation-App/tree/master">
                      <ion-icon name="logo-github" size="large"></ion-icon>
                    </a>
                  </button>
                </div>
              </div>
              <div className="px-2">
                <h2 className=" capitalize font-bold">Website</h2>
                <h3 className="capitalize font-medium">
                  Movie Recommendation website.
                </h3>

                <p className=" text-justify font-normal">
                  This project recommend movies bases on genre using ReactJS
                  with Redux for state management and local storage for data
                  persistence and Tailwind CSS for styling.
                </p>
              </div>
            </article>

            <article className="px-6 py-4 flex flex-col gap-4 bg-white rounded-lg">
              <div className="relative overflow-hidden group">
                <img src={Project3} alt="" className=" w-full" />
                <div className=" absolute w-full h-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="cursor-pointer text-orange-500 bg-transparent w-[50px] h-[50px] border-2 border-orange-500 rounded-full">
                    <a href="https://github.com/Mikun07/New-portfolio">
                      <ion-icon name="logo-github" size="large"></ion-icon>
                    </a>
                  </button>
                </div>
              </div>
              <div className="px-2">
                <h2 className=" capitalize font-bold">Website</h2>
                <h3 className="capitalize font-medium">Portfolio Website.</h3>

                <p className=" text-justify font-normal">
                  This portfolio is a beautifully designed, modern,
                  and responsive website built using ReactJS and Tailwind CSS.
                </p>
              </div>
            </article>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;