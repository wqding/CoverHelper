import React from 'react';

import config from '../config/index.json';

const MainHeroVideo = () => {
  const { mainHero } = config;
  return (
    <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <video
        className="h-full w-full object-contain sm:h-auto md:h-auto lg:w-full lg:h-full rounded-lg border-2 border-black-40 "
        src={mainHero.vid}
        autoPlay={true}
        loop={true}
        playsInline={true}
      />
    </div>
  );
};

export default MainHeroVideo;
