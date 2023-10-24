import React from "react";

function ProjectCard({ Img, Href, Title, SubTitle, Info }) {
  return (
    <>
      <article className="px-6 py-4 flex flex-col gap-4 bg-white rounded-lg">
        <div className="relative overflow-hidden group">
          <img src={Img} alt="" className="w-full" />
          <div className=" absolute w-full h-full bg-black/20 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="cursor-pointer text-white bg-transparent w-[50px] h-[50px] border-2 border-white rounded-full">
              <a target="_blank" href={Href}>
                <ion-icon name="logo-github" size="large"></ion-icon>
              </a>
            </button>
          </div>
        </div>
        <div className="">
          <h2 className=" capitalize text-sm font-bold">{SubTitle}</h2>
          <h3 className="capitalize font-medium">{Title}</h3>

          <p className="text-justify font-normal leading-6 tracking-wide">
            {Info}
          </p>
        </div>
      </article>
    </>
  );
}

export default ProjectCard;
