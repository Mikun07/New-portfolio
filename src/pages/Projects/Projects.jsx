import React, { useState } from "react";
import Project1 from "../../assets/img/project-1.jpg";
import Project2 from "../../assets/img/project-2.jpg";
import Project3 from "../../assets/img/project-3.jpg";
import ProjectCard from "../../components/Card/ProjectCard";

const projectData = [
  {
    Img: Project2,
    Github: "https://github.com/Mikun07/Product_Search.git",
    Href: "https://productseacrh.netlify.app",
    Title: "Website",
    SubTitle: "Product Search.",
    Info: " product search and comparison website, hosted on Docker and Vite, uses Cypress for end-to-end testing with documentation available on GitHub.",
  },
  {
    Img: Project3,
    Github: "https://github.com/Mikun07/Movie-Recommendation-Website.git",
    Href: "https://mikun-films.netlify.app",
    Title: "Website",
    SubTitle: "Movie Recommendation website.",
    Info: "Movie recommendations by genre via ReactJS, state management with Redux, data persistence in local storage, and Tailwind CSS styling.",
  },
  {
    Img: Project2,
    Github: "https://github.com/Mikun07/hotel-booking-dashboard.git",
    Href: "https://mimabooking.netlify.app",
    Title: "Website",
    SubTitle: "Hotel Booking Dashboard.",
    Info: "A stunning hotel booking dashboard interface crafted with ReactJS and enhanced by Tailwind CSS design.",
  },
  {
    Img: Project1,
    Github: "https://github.com/Mikun07/Blog-Frontend.git",
    Href: "https://binary-blog.netlify.app/",
    Title: "Website",
    SubTitle: "Binary Blog.",
    Info: "A modern, responsive Blog website, elegantly crafted with ReactJS and styled with Tailwind CSS and PHP Laravel for the backend.",
  },
  {
    Img: Project3,
    Github: "https://github.com/Mikun07/New-portfolio.git",
    Href: "https://festus-olaleye-ayomikun.netlify.app",
    Title: "Website",
    SubTitle: "Portfolio Website.",
    Info: "A modern, responsive portfolio website, elegantly crafted with ReactJS and enhanced by Tailwind CSS design.",
  },
];

function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  // Calculate the current projects to display
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projectData.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Calculate total pages
  const totalPages = Math.ceil(projectData.length / projectsPerPage);

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      name="project"
      className="lg:h-screen w-full lg:px-20 px-4 flex items-center justify-center bg-gray-200"
    >
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <h1 className="section__title-1 capitalize font-bold">
            <span>Projects.</span>
          </h1>
        </div>

        <div className="p-2">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
            {currentProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="cursor-pointer font-bold capitalize hover:scale-110 duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="cursor-pointer font-bold capitalize hover:scale-110 duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
