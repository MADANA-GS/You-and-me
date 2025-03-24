import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const [message, setMessage] = useState(null);
  const messages = [
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col landing gap-2 md:gap-4 text-center" key="1">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">You’re just</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">too good</h1>
        </div>
        <div className="hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center ">with</h1>
        </div>
        <div className="hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-yellow-300">your hands</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 items-center justify-center flex-col gap-2 md:gap-4 text-center" key="2">
      <div className="flex main flex-col md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Do you have</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">a sunburn</h1>
        </div>
        <div className="hero3 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">or are you <span className="text-red-300">this hot</span></h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="3">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">I'm not feeling</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-blue-400">myself today.</h1>
        </div>
        <div className="hero3 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Can I feel you instead?</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="4">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Is it hot in here,</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-orange-400">or is it just you?</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="5">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">I can’t find my Uber –</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-pink-400">can I ride you instead?</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="6">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Well, here I am.</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-green-400">What are your other two wishes?</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="7">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Are you Siri?</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-purple-400">Because you autocomplete me.</h1>
        </div>
      </div>
    </div>,
  
    <div className="flex ff h-auto pt-32 md:pt-20 flex-col gap-2 md:gap-4 text-center" key="8">
      <div className="flex flex-col justify-start md:items-center">
        <div className="hero1 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center">Four and four become eight,</h1>
        </div>
        <div className="hero2 hero">
          <h1 className="text-7xl md:text-[10vw] md:self-center text-red-400">but you and I can be fate.</h1>
        </div>
      </div>
    </div>,
  ];

  const navigate = useNavigate();

  useGSAP(() => {
    gsap.set(".hero h1", { opacity: 0, y: 80 }); // Set initial state
  
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
    });
  
    tl.to(".hero h1", {
      opacity: 1,
      y: 0,
      stagger: 0.15, // Slightly faster stagger
    });
    
  }, [message]);
  
  useEffect(() => {
    const random = Math.floor(Math.random() * messages.length);
    setMessage(messages[random]);
  }, []);

  return (
    <div className=" w-full z-[999] h-auto  flex flex-col items-center justify-center">
      <div className="text-white ">{message}</div>
      <button onClick={()=> navigate("/memory")} className="text-white box mt-20 mb-40 bg-[#03e9f4] boxsh uppercase tracking-[4px] text-3xl md:text-6xl rounded-lg border-2 border-[#03e9f4] px-[22px] py-[7px]">
        Memories
      </button>
    </div>
  );
};

export default Landing;
