import React from 'react';

import config from '../config/index.json';

const About = () => {
  const { company, about } = config;
  const { logo, name: companyName } = company;
  const { socialMedia } = about;

  return (
    <div
      id="about"
      className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 py-12"
    >
      <div className="flex flex-col items-center justify-center">
        <div>
          <img src={logo} alt={companyName} className="w-20 h-20" />
        </div>
        <h1>
          Contact Us
        </h1>
        <div className="flex items-center gap-x-8 mt-6 h-8">
          {socialMedia.map((social) => (
            <a
              aria-label={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className={`inline-block h-6 w-6 `}
                src={social.icon}
              />
              {social.name === 'email' && " CoverHelper.contact@gmail.com"}
            </a>
          ))}
        </div>
        <div className="flex items-center mt-6">
          <p className="mt-6 text-xs lg:text-sm leading-none text-gray-900 dark:text-gray-50">
            &copy; {new Date().getFullYear()} {' '}
            <a href="https://coverhelper.live" rel="nofollow">
              CoverHelper
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;