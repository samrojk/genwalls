import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollbehaviour = () => {
  const { key } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [key]);

  return null;
};

export default scrollbehaviour;
