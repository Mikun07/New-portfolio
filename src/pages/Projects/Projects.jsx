import React, { useState } from "react";
import Project1 from "../../assets/img/project-1.jpg";
import Project2 from "../../assets/img/project-2.jpg";
import Project3 from "../../assets/img/project-3.jpg";
import ProjectCard from "../../components/Card/ProjectCard";

function Projects() {
  const [showModel, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);

  return (
    <>
      <div
        name="project"
        className="lg:h-screen w-full lg:px-20 px-4 flex items-center justify-center bg-gray-200"
      >
        <div className="flex flex-col">
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>Projects.</span>
            </h1>
          </div>

          <div className="p-2 ">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
              <ProjectCard
                Img={Project3}
                Github="https://github.com/Mikun07/New-portfolio.git"
                Href="https://festus-olaleye-ayomikun.netlify.app"
                Title="Website"
                SubTitle="Portfolio Website."
                Info="A modern, responsive portfolio website, elegantly crafted with ReactJS and enhanced by Tailwind CSS design."
              />
               <ProjectCard
                Img={Project1}
                Github="https://github.com/Mikun07/Movie-Recommendation-Website.git"
                Href="https://mikun-films.netlify.app"
                Title="Website"
                SubTitle="Movie Recommendation website."
                Info="Movie recommendations by genre via ReactJS, state management with Redux, data persistence in local storage, and Tailwind CSS styling."
              />
              <ProjectCard
                Img={Project2}
                Github="https://github.com/Mikun07/hotel-booking-dashboard.git"
                Href="https://mimabooking.netlify.app"
                Title="Website"
                SubTitle="Hotel Booking Dashboard."
                Info="A stunning hotel booking dashboard interface crafted with ReactJS and enhanced by Tailwind CSS design."
              />
            </div>

            <div className="flex justify-center items-end my-3">
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer font-bold capitalize hover:scale-110 duration-300"
              >
                See More
              </button>

              {showModel ? (
                <div
                  visible={showModel}
                  className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center"
                >
                  <div className="bg-gray-200 rounded mx-4 py-4 w-screen overflow-hidden">
                    <div className=" flex justify-end mr-2">
                      <button
                        onClick={handleOnClose}
                        className="justify-center items-center text-lg font-bold"
                      >
                        <ion-icon name="close" size="large"></ion-icon>
                      </button>
                    </div>
                    <div className="flex items-center lg:gap-4 gap-2 lg:px-6 px-1 overflow-x-auto custom__scrollbar">
                      <ProjectCard
                        Img={Project3}
                        Github=""
                        Href="https://festus-olaleye-ayomikun.netlify.app"
                        Title="Website"
                        SubTitle="Portfolio Website."
                        Info="A modern, responsive portfolio website, elegantly crafted with ReactJS and enhanced by Tailwind CSS design."
                      />
                      <ProjectCard
                        Img={Project2}
                        Github=""
                        Href="https://mimabooking.netlify.app"
                        Title="Website"
                        SubTitle="Hotel Booking Dashboard."
                        Info="A stunning hotel booking dashboard interface crafted with ReactJS and enhanced by Tailwind CSS design."
                      />
                      <ProjectCard
                        Img={Project1}
                        Github=""
                        Href="https://mikun-films.netlify.app"
                        Title="Website"
                        SubTitle="Movie Recommendation website."
                        Info="Movie recommendations by genre via ReactJS, state management with Redux, data persistence in local storage, and Tailwind CSS styling."
                      />
                       <ProjectCard
                        Img={Project3}
                        Github="https://github.com/Mikun07/Blog-Frontend.git"
                        Href="https://binary-blog.netlify.app/"
                        Title="Website"
                        SubTitle="Binary Blog."
                        Info="A modern, responsive Blog website, elegantly crafted with ReactJS and styled with Tailwind CSS and PHP Laravel for the backend."
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
