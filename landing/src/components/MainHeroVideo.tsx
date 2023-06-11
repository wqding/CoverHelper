import React from 'react';

import config from '../config/index.json';

const MainHeroVideo = () => {
  const { mainHero } = config;
  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 p-5">
      <video
        className="h-full w-full object-contain sm:h-auto md:h-auto lg:w-full lg:h-full rounded-lg"
        src={mainHero.vid}
        autoPlay={true}
        loop={true}
        playsInline={true}
      />
    </div>
  );
};

export default MainHeroVideo;
