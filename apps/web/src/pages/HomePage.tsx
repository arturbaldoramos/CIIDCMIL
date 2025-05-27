import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button'; // Assuming Shadcn Button component is correctly aliased

export function HomePage() {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/welcome'); // Navigate to the welcome page
  };

  return (
    <div className="min-h-screen  text-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-bold flex leading-tight mb-8">
          Percepção das Barreiras Culturais e de Comunicação percebidas no Website da Prefeitura de Recife
        </h1>

        <Button
          onClick={handleNextClick}
          variant={'secondary'}
          className="hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out text-base sm:text-lg"
          size="lg"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}