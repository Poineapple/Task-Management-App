import React, { useEffect } from "react";
import "../styling.css";

// Custom hook to listen for mouse movements and update the CSS variables
const MouseListener = ({ posRef }) => {
  useEffect(() => {
    const logMousePosition = (e) => {
      if (posRef.current) {
        const rect = posRef.current.getBoundingClientRect(); // Get the position of the element
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top; //y position within the element.

        const midX = rect.width / 2;
        const midY = rect.height / 2;

        const offsetX = ((x - midX) / midX) * 20;
        const offsetY = ((y - midY) / midY) * 20;

        // Set the CSS variables to the mouse position
        posRef.current.style.setProperty("--rotateX", offsetX + "deg");
        posRef.current.style.setProperty("--rotateY", -1 * offsetY + "deg");
      }
    };

    // Reset the mouse position when the mouse leaves the element
    const handleMouseLeave = () => {
      if (posRef.current) {
        posRef.current.style.setProperty("--rotateX", 0);
        posRef.current.style.setProperty("--rotateY", 0);
      }
    };

    // Attach the event listener to the element referred by `posRef`
    const element = posRef.current;
    if (element) {
      element.addEventListener("mousemove", logMousePosition);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    // Remove the event listener when the component unmounts
    return () => {
      if (element) {
        element.removeEventListener("mousemove", logMousePosition);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [posRef]); // Re-run the effect if the ref changes

  return null; // The component does not render anything
};

export default MouseListener;
