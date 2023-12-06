import React from "react";

function ProjectCard({ Img, Href, Github, Title, SubTitle, Info }) {
  return (
    <>
      <article className="lg:w-[360px] w-[300px] h-[380px] flex flex-col gap-4 bg-white rounded-lg">
        <div className="relative overflow-hidden group">
          <img
            src={Img}
            alt=""
            className="lg:w-[360px] w-[300px] rounded-t-lg"
          />
          <div className=" absolute lg:w-[360px] w-[300px] h-full bg-black/75 rounded-t-lg flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className=" flex gap-6">
              <button className="cursor-pointer text-white bg-transparent w-[50px] h-[50px] border-2 border-white rounded-full">
                <a target="_blank" href={Github}>
                  <ion-icon name="logo-github" size="large"></ion-icon>
                </a>
              </button>
              <button className="cursor-pointer text-white bg-transparent w-[50px] h-[50px] border-2 border-white rounded-full">
                <a target="_blank" href={Href}>
                  <ion-icon name="globe-outline" size="large"></ion-icon>
                </a>
              </button>
            </div>
          </div>
        </div>
        <div className=" lg:w-[360px] w-[300px] flex flex-col gap-2 px-4 pb-3">
          <p className="capitalize font-bold text-xs section__title-2">
            {SubTitle}
          </p>
          <p className="capitalize text-sm font-bold">{Title}</p>

          <p className="text-justify font-normal leading-6 tracking-tighter">
            {Info}
          </p>
        </div>
      </article>
    </>
  );
}

export default ProjectCard;
