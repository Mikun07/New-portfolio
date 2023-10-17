import React from "react";
import Project1 from "../../assets/img/project-1.jpg";
import Project2 from "../../assets/img/project-2.jpg";
import Project3 from "../../assets/img/project-3.jpg";
import ProjectCard from "../../components/Card/ProjectCard";

function Projects() {
  return (
    <>
      <div
        name="project"
        className="lg:h-screen lg:pt-0 md:pt-[550px] sm:pt-[550px] pt-[450px] lg:px-20 px-4 flex items-center justify-center bg-gray-200"
      >
        <div className="flex flex-col">
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>Projects.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
            <ProjectCard
              Img={Project1}
              Href="https://github.com/Mikun07/Movie-Recommendation-App/tree/master"
              Title="Website"
              SubTitle="Movie Recommendation website."
              Info=" This project recommend movies bases on genre using ReactJS
              with Redux for state management and local storage for data
              persistence and Tailwind CSS for styling."
            />
            <ProjectCard
              Img={Project3}
              Href="https://github.com/Mikun07/New-portfolio"
              Title="Website"
              SubTitle="Portfolio Website."
              Info="This portfolio is a beautifully designed, modern, and responsive website built using ReactJS and Tailwind CSS."
            />
            <ProjectCard
              Img={Project2}
              Href="https://mimabooking.netlify.app/"
              Title=">Website"
              SubTitle="Hotel Booking Dashboard."
              Info=" This is a beautifully designed hotel booking dashboard built
                  using ReactJS and Tailwind CSS."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
