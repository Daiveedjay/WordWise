import React, { useEffect } from "react";
import lottie from "lottie-web";



const LoadingComponent = ({LoadingAnimation}) => {
  useEffect(() => {
    const animationData = LoadingAnimation;

    // Find the element where you want to render the animation
    const container = document.getElementById("animation-container");

    // Load and play the animation
    const anim = lottie.loadAnimation({
      container,
      animationData,
      renderer: "svg", // You can choose 'svg', 'canvas', 'html' based on your preference
      loop: true,
      autoplay: true,
    });

    return () => {
      anim.destroy(); // Clean up when the component unmounts
    };
  }, [LoadingAnimation]);

  return <div id="animation-container" />;
};

export default LoadingComponent;
