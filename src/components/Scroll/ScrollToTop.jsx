import React, { useEffect, useState } from "react";
import { useWindowScroll } from "react-use";

const ScrollToTop = () => {
  const { y: pageYOffset } = useWindowScroll();
  const [visible, setVisiblity] = useState(false);

  useEffect(() => {
    if (pageYOffset > 400) {
      setVisiblity(true);
    } else {
      setVisiblity(false);
    }
  }, [pageYOffset]);

  const ScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) {
    return false;
  }
  return (
    <>
      <div className="scrolltotop-container" onClick={ScrollToTop}>
        <div className="scrolltotop-icon">
          <ion-icon name="chevron-up-outline"></ion-icon>
        </div>
      </div>
    </>
  );
};

export default ScrollToTop;
