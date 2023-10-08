import React from "react";

function IconBtn({Icon}) {
  return (
    <>
      <div className="bg-black flex items-center text-center h-[30px] w-[30px] md:h-[42px] md:w-[42px] rounded-full text-xs md:text-lg sm:text-lg text-white justify-center cursor-pointer">
        <ion-icon name={Icon}></ion-icon>
      </div>
    </>
  );
}

export default IconBtn;
