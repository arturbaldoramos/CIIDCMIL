import { h1 } from 'framer-motion/client';
import React from 'react';

interface SurveyTitleProps {
  title: string;
}

const SurveyTitle: React.FC<SurveyTitleProps> = ({ title }) => {
  const words = title.split(' ');
  
  return (
    /*
    <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {word}
          {index< words.length - 1 && <br />}
        </React.Fragment>
      ))}
    </h1>*/
    <h1 className="text-4xl font-bold leading-tight tracking-tight">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {word}
          {index< words.length - 1 && <br />}
        </React.Fragment>
      ))}

    </h1>
  );
};

export default SurveyTitle;