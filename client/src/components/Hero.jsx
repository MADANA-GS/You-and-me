import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TiltedCard from "./TiltedCard";
import { AuthContext } from "../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    console.log(id);
    navigate(`/memory/${id}`);
  };

  const { navmemories, setNavMemories } = useContext(AuthContext);

  return (
    <>
      <div className="w-full h-auto flex flex-col items-center justify-center mb-10">
        <div className="mt-36 md:mt-48 w-screen flex items-center justify-between px-6 md:px-44 mb-5">
          <h1 className="text-xl md:text-3xl font-medium">Bringing Memories to Life</h1>
          <Link to="/memory" className="text-xl md:flex hidden md:text-3xl font-medium underline">
            See More
          </Link>
        </div>

        {/* Grid with proper spacing */}
        <div className="w-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-3 gap-3 place-items-center">
          {navmemories.slice(0, 3).map((item) => (
            <div key={item._id} onClick={() => handleNavigate(item._id)} className="cursor-pointer">
              <TiltedCard
                imageSrc={item.thumbnailImage}
                altText={item.title}
                captionText={item.title}
                containerHeight="clamp(400px, 30vw, 600px)" // Increased size
                containerWidth="clamp(350px, 25vw, 500px)"
                imageHeight="clamp(400px, 30vw, 600px)"
                imageWidth="clamp(350px, 25vw, 500px)"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="tilted-card-demo-text text-white text-lg font-semibold">
                    {item.title}
                  </p>
                }
              />
            </div>
          ))}
        </div>
        <Link to="/memory" className="text-xl md:hidden mt-5 ml-60 text-right flex md:text-3xl font-medium pb-2 underline">
          See More
        </Link>
      </div>
    </>
  );
};

export default Hero;
