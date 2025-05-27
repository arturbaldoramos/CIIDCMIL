import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button'; // Assuming Shadcn Button component

export function WelcomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    // Logic to start the questionnaire or navigate to the first question
    console.log("Starting the questionnaire!");
    // navigate('/question/1'); // Example: navigate to the first question
  };

  return (
    <div className="min-h-screen bg-whiteblackack flex flex-col p-4 relative">

      <div className="flex flex-col justify-start max-w-2xl mx-auto py-4">
        <h2 className="text-4xl font-bold mb-6">Olá!</h2>

        <p className="mb-4 text-black font-semibold">
          Você está sendo convidado(a) a colaborar com um estudo sobre sua percepção em relação às Barreiras culturais e de comunicação presentes no website oficial da Prefeitura Municipal de Blumenau. Sua opinião é muito importante para nos ajudar a compreender melhor essas questões e promover melhorias.
        </p>
        <p className="mb-4 text-black font-semibold">
          As respostas serão fornecidas em uma escala de 0 a 10, com os seguintes indicação:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4 text-black font-semibold">
          <li>
            <span className="font-semibold">10:</span> Você percebe um grande número de barreiras de comunicação.
          </li>
          <li>
            <span className="font-semibold">0:</span> Você percebe nenhuma barreira.
          </li>
        </ul>

        <p className="mb-4 text-black font-semibold italic">
          Os valores intermediários devem ser usados para graduar sua percepção das barreiras da comunicação, atentando-se para que, quanto mais alta for sua percepção, maior será o valor.
        </p>

        <p className="mb-4 texblack">
          Responda de acordo com a sua percepção pessoal. Sua participação é totalmente anônima, e sua identidade será preservada. Caso os resultados sejam publicados, você será previamente informado.
        </p>
        <p className="mb-6 text-black">
          Para que suas respostas sejam coerentes, sugerimos que você observe o website oficial enquanto responde às perguntas. Recomendamos visualizá-lo em um dispositivo em uma tela, como um computador desktop ou notebook, enquanto responde ao questionário via smartphone para enriquecer sua percepção e permitir uma análise mais abrangente.
        </p>

        <p className="mb-8 text-black">
          Agradecemos muito sua colaboração!
        </p>

        <div className="flex col-span-1 justify-center"> {}
          <Button
            onClick={handleStartClick}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out"
            size="lg"
          >
            Vamos lá!
          </Button>
        </div>
      </div>
    </div>
  );
}