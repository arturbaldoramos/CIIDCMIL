import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Supondo que você tenha ou crie este componente
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const questionnaireSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

export default function CreateQuestionnairePage() {
  const navigate = useNavigate();
  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: QuestionnaireFormValues) => {
    try {
      const response = await api.post('/questionnaires', data);
      const newQuestionnaireId = response.data.id;
      navigate(`/dashboard/questionnaires/${newQuestionnaireId}/edit`);
    } catch (error) {
      console.error("Erro ao criar questionário:", error);
      // Aqui você pode usar o seu componente de "toast" ou "alert"
    }
  };

  return (
    
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Questionário</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pesquisa de Satisfação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o objetivo do questionário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Criando...' : 'Criar e Adicionar Perguntas'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Você precisará criar um componente Textarea em `components/ui/textarea.tsx`
// Pode se basear no componente Input