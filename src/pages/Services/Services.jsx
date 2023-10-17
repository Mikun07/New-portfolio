import React from "react";

function Services() {
  return (
    <>
      <div name="services" className="h-screen lg:pt-0 md:pt-[550px] sm:pt-[550px] pt-[750px] lg:px-20 px-4 flex items-center bg-gray-200">
        <div className="flex flex-col">   
          <div className=" flex justify-center items-center">
            <h1 className="section__title-1 capitalize font-bold">
              <span>services.</span>
            </h1>
          </div>

          <div className="flex lg:flex-row flex-col gap-6">

            <article className="services__card">
              <div className="services__border"></div>

              <div className=" services__content">
                <div className="services__icon">
                  <div className="services__box"></div>
                  <ion-icon name="grid-outline"></ion-icon>
                </div>

                <h2 className="services__title capitalize font-bold">
                  Web Design
                </h2>

                <p className="services__description">
                  Beautiful and elegant designs with interfaces that are
                  intuitive, efficient and pleasant to use for user.
                </p>
              </div>
            </article>

            <article className="services__card">
              <div className="services__border"></div>

              <div className=" services__content">
                <div className="services__icon">
                  <div className="services__box"></div>
                  <ion-icon name="code-slash-outline"></ion-icon>
                </div>

                <h2 className="services__title capitalize font-bold">
                development
                </h2>

                <p className="services__description">
                  Custom web development tailored to your specifications,
                  designed to provide a flawless user experience.
                </p>
              </div>
            </article>

          </div>

        </div>
      </div>
    </>
  );
}

export default Services;
