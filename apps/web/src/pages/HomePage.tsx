import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';

export function HomePage() {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 ">
      <div className=" max-w-xl mx-auto p-6">
        <h1 className="text-[40px] leading-[45px] sm:text-5xl md:text-5xl lg:text-5xl font-semibold mb-8 ">
          Percepção das Barreiras Culturais e de Comunicação percebidas no Website da Prefeitura de Recife
        </h1>

        <Button
          onClick={handleNextClick}
          variant={"default"}
          size="lg"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}