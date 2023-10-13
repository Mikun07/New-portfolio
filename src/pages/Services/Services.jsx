import React from "react";

function Services() {
  return (
    <>
      <div name="services" className=" w-full px-4 bg-gray-200">
        <div className="max-w-screen-lg mx-auto pt-[60px] pb-16 w-full h-full flex flex-col justify-center gap-6">
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
                  intutive, efficient and pleasant to use for user.
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
                  Custom web development tailored to your specificatons,
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
