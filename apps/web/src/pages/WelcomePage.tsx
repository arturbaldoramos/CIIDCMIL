import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';

export function WelcomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    console.log("Starting the questionnaire!");
    // navigate('/question/1'); // Exemplo: navegar para a primeira pergunta
  };

  return (
    <div className="min-h-screen  text-foreground flex flex-col items-center p-4 pt-12 relative">

      <div className="flex flex-col justify-start max-w-3xl mx-auto py-4 px-6 bg-card rounded-lg ">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary">Olá!</h2>

        <p className="mb-4 text-sm sm:text-base md:text-lg text-foreground ">
          Você está sendo convidado(a) a colaborar com um estudo sobre sua percepção em relação às Barreiras culturais e de comunicação presentes no website oficial da Prefeitura Municipal de Blumenau. Sua opinião é muito importante para nos ajudar a compreender melhor essas questões e promover melhorias.
        </p>
        <p className="mb-4 text-sm sm:text-base md:text-lg text-foreground">
          As respostas serão fornecidas em uma escala de 0 a 10, com os seguintes indicação:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4 text-sm sm:text-base md:text-lg text-foreground">
          <li>
            <span className="text-primary">10:</span> Você percebe um grande número de barreiras de comunicação.
          </li>
          <li>
            <span className="text-primary">0:</span> Você percebe nenhuma barreira.
          </li>
        </ul>

        <p className="mb-4 text-sm sm:text-base md:text-lg text-foreground font-semibold">
          Os valores intermediários devem ser usados para graduar sua percepção das barreiras da comunicação, atentando-se para que, quanto mais alta for sua percepção, maior será o valor.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg text-foreground">
          Responda de acordo com a sua percepção pessoal. Sua participação é totalmente anônima, e sua identidade será preservada. Caso os resultados sejam publicados, você será previamente informado.
        </p>
        <p className="mb-6 text-sm sm:text-base md:text-lg text-foreground">
          Para que suas respostas sejam coerentes, sugerimos que você observe o website oficial enquanto responde às perguntas. Recomendamos visualizá-lo em um dispositivo em uma tela, como um computador desktop ou notebook, enquanto responde ao questionário via smartphone para enriquecer sua percepção e permitir uma análise mais abrangente.
        </p>

        <p className="mb-8 text-sm sm:text-base md:text-lg text-foreground">
          Agradecemos muito sua colaboração!
        </p>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleStartClick}
            size="lg"
          >
            Vamos lá!
          </Button>
        </div>
      </div>
    </div>
  );
}