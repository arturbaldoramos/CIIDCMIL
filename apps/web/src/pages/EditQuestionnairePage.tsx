import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrashIcon } from 'lucide-react';
import api from '@/lib/api';

interface Question {
  id?: number;
  text: string;
  order: number;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
}

export default function EditQuestionnairePage() {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        // Você precisará de um endpoint para buscar o questionário para edição
        const response = await api.get(`/questionnaires/${id}/edit`);
        setQuestionnaire(response.data);
      } catch (error) {
        console.error("Erro ao buscar questionário:", error);
      }
    };
    if (id) {
      fetchQuestionnaire();
    }
  }, [id]);

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim() || !questionnaire) return;
    
    const newOrder = questionnaire.questions.length > 0
        ? Math.max(...questionnaire.questions.map(q => q.order)) + 1
        : 0;

    const newQuestion: Question = { text: newQuestionText, order: newOrder };

    try {
      const response = await api.put(`/questionnaires/${id}/question`, newQuestion);
      setQuestionnaire(prev => prev ? ({ ...prev, questions: [...prev.questions, response.data] }) : null);
      setNewQuestionText('');
    } catch (error) {
      console.error("Erro ao adicionar pergunta:", error);
    }
  };
  
  if (!questionnaire) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{questionnaire.title}</h1>
        <p className="text-muted-foreground">{questionnaire.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input 
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Digite o texto da sua pergunta aqui"
          />
          <Button onClick={handleAddQuestion}>Adicionar</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Perguntas</h2>
        {questionnaire.questions.map((question, index) => (
          <Card key={question.id || index} className="p-4 flex items-center justify-between">
            <span>{question.order + 1}. {question.text}</span>
            <Button variant="ghost" size="icon">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Card>
        ))}
        {questionnaire.questions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">Nenhuma pergunta adicionada ainda.</p>
        )}
      </div>
    </div>
  );
}