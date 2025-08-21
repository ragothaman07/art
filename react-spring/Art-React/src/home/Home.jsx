import React, { useState } from "react";
import Header from "../header/Header";
import Gallery from "./gallery/Gallery";
import Upload from "./upload/Upload";

const Home = () => {
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="w-full h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "gallery" && <Gallery />}
        {activeTab === "upload" && <Upload />}
      </div>
    </div>
  );
};

export default Home;