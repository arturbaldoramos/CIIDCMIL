import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { QuickEditQuestionnaireDialog } from '@/components/QuickEditQuestionnaireDialog';

interface Questionnaire {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
}

export default function QuestionnaireListPage() {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setLoading(true);
        const response = await api.get('/questionnaires');
        setQuestionnaires(response.data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar os questionários.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  const handleUpdateList = (updated: Questionnaire) => {
    setQuestionnaires(prev => prev.map(q => q.id === updated.id ? updated : q));
  };

  const handleDeleteFromList = (deletedId: string) => {
    setQuestionnaires(prev => prev.filter(q => q.id !== deletedId));
  };

  if (loading) {
    // Você pode substituir isso por um componente Skeleton para uma melhor UX
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus Questionários</h1>
          <Button onClick={() => navigate('/dashboard/questionnaires/new')}>
            Criar Novo
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionnaires.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.title}</TableCell>
                  <TableCell>
                    <Badge variant={q.isActive ? 'default' : 'outline'}>
                      {q.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingQuestionnaire(q)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edição Rápida</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigate(`/dashboard/questionnaires/${q.id}/edit`)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Editar Perguntas</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {questionnaires.length === 0 && (
            <div className="text-center p-8">
              <CardTitle>Nenhum questionário encontrado</CardTitle>
              <CardDescription className="mt-2">
                Clique em "Criar Novo" para começar.
              </CardDescription>
            </div>
          )}
        </Card>

        <QuickEditQuestionnaireDialog
          questionnaire={editingQuestionnaire}
          isOpen={!!editingQuestionnaire}
          onClose={() => setEditingQuestionnaire(null)}
          onSave={handleUpdateList}
          onDelete={handleDeleteFromList}
        />
      </div>
    </div>);
}