import React from "react";
import img1 from "../assets/facebook.svg";
import img2 from "../assets/framer.svg";
import img3 from "../assets/google.svg";
import img4 from "../assets/instagram.svg";
import img5 from "../assets/linkedin.svg";
import img6 from "../assets/netflix.svg";
import img7 from "../assets/slack.svg";

const images = [img1, img2, img3, img4, img5, img6, img7];

const InfiniteSlider = () => {
  return (
    <div className="relative overflow-hidden py-10">
      <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
        {[...images, ...images].map((img, index) => (
          <div
            key={index}
            className="mx-4 shrink-0 w-350px h-100px rounded-xl overflow-hidden"
          >
            <img
              src={img}
              alt="slider"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;