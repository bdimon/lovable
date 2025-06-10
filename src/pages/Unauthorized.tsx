
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShieldX className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Доступ запрещен
        </h1>
        
        <p className="text-gray-600 mb-6">
          У вас недостаточно прав для доступа к этой странице.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            Вернуться на главную
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="w-full"
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
