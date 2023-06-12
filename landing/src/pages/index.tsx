import React from 'react';

import About from '../components/About';
import Analytics from '../components/Analytics';
import Canvas from '../components/Canvas';
import Features from '../components/Features';
import Header from '../components/Header';
import LazyShow from '../components/LazyShow';
import MainHero from '../components/MainHero';
import Product from '../components/Product';
import MainHeroVideo from '../components/MainHeroVideo';

const App = () => {
  return (
    <div className={`bg-background grid gap-y-16 overflow-hidden`}>
      <div className={`relative bg-background`}>
        <div className="max-w-full mx-5">
          <div
            className={`relative z-0 pb-8 bg-background lg:w-full`}
          >
            <Header />
            <div className='flex flex-wrap'>
              <div className="w-full lg:w-2/5">
                <MainHero />
              </div>
              <div className="w-full lg:w-3/5">
                <MainHeroVideo />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Canvas />
      <LazyShow>
        <>
          <Product />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <Features />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <About />
        </>
      </LazyShow>
      <Analytics />
    </div>
  );
};

export default App;
