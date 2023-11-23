import React from "react";
import Content from "./Content";

const MainBody = () => {
  const divStyle = {
    background: 'url("hero-student.png")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    minHeight: "100vh",
  };

  return (
    <div style={divStyle} className="font-Raleway bg-neutral">
      <div className="container mx-auto flex flex-col min-h-screen h-fit w-screen pe-10">
        <h1
          className="font-Croissant mt-auto mb-4 ms-auto select-none text-accent"
          style={{ fontSize: 160 }}
        >
          Ascendre
        </h1>
        <Content />
      </div>
    </div>
  );
};

export default MainBody;
