import React from 'react';
import Button from '../components/Button';
import SurveyTitle from '../components/SurveyTitle';

const SurveyPage: React.FC = () => {
  const surveyTitle = 'Percepção das Barreiras Culturais e de Comunicação percebidas no Website da Prefeitura de Recife';
  
  const handleNext = () => {
    
    
  };

  return (
    <div className="min-h-screen w-100 flex flex-col justify-items-center">
      <main className="flex-grow flex flex-col px-6 py-8 md:px-12 lg:">
        <div className="flex-grow flex flex-col justify-start max-w-2xl ml-0">
          <SurveyTitle title={surveyTitle} />
          
          <div className="m-auto pt-8 pb-4 md:pt-12">
            <Button onClick={handleNext}>Próximo</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SurveyPage;