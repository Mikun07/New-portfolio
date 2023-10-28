import React, { useState } from "react";
import Project1 from "../../assets/img/project-1.jpg";
import Project2 from "../../assets/img/project-2.jpg";
import Project3 from "../../assets/img/project-3.jpg";
import ProjectCard from "../../components/Card/ProjectCard";
import SeeMoreProjectModal from "../../components/Modal/SeeMoreProjectModal";

function Projects() {
  const [showModel, setShowModal] = useState(false);
  const handleOnClose = () => setShowModal(false);

  return (
    <>
      <div
        name="project"
        className="lg:h-screen lg:pt-[85px] md:pt-[550px] sm:pt-[550px] pt-[450px] lg:px-20 px-4 flex items-center justify-center bg-gray-200"
      >
        <div className="flex flex-col">
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>Projects.</span>
            </h1>
          </div>

          <div className="p-2 ">
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
              <ProjectCard
                Img={Project3}
                Href="https://festus-olaleye-ayomikun.netlify.app"
                Title="Website"
                SubTitle="Portfolio Website."
                Info="A modern, responsive portfolio website, elegantly crafted with ReactJS and enhanced by Tailwind CSS design."
              />
              <ProjectCard
                Img={Project2}
                Href="https://mimabooking.netlify.app"
                Title="Website"
                SubTitle="Hotel Booking Dashboard."
                Info="A stunning hotel booking dashboard crafted with ReactJS and enhanced by Tailwind CSS design."
              />
              <ProjectCard
                Img={Project1}
                Href="https://mikun-films.netlify.app"
                Title="Website"
                SubTitle="Movie Recommendation website."
                Info="Movie recommendations by genre via ReactJS, state management with Redux, data persistence in local storage, and Tailwind CSS styling."
              />
            </div>

            <div className="flex justify-center items-end my-3">
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer font-bold capitalize hover:scale-110 duration-300"
              >
                See More
              </button>

              <SeeMoreProjectModal
                onClose={handleOnClose}
                visible={showModel}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
