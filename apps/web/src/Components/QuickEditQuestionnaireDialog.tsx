import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import api from '@/lib/api';

interface Questionnaire {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
}

interface QuickEditDialogProps {
  questionnaire: Questionnaire | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestionnaire: Questionnaire) => void;
  onDelete: (id: string) => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "O título é obrigatório." }),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export function QuickEditQuestionnaireDialog({ questionnaire, isOpen, onClose, onSave, onDelete }: QuickEditDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (questionnaire) {
      form.reset({
        title: questionnaire.title,
        description: questionnaire.description || '',
        isActive: questionnaire.isActive,
      });
    }
  }, [questionnaire, form]);

  if (!questionnaire) return null;

  const handleSave = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await api.patch(`/questionnaires/${questionnaire.id}`, data);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/questionnaires/${questionnaire.id}`);
      onDelete(questionnaire.id);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edição Rápida</DialogTitle>
          <DialogDescription>
            Altere o título, a descrição e o estado do seu questionário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input {...field} /></FormControl> {/* Pode ser um Textarea */}
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Ativo</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <DialogFooter className="pt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="destructive">Excluir</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <div className="space-y-2">
                    <p className="text-sm">Tem certeza?</p>
                    <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">Confirmar Exclusão</Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}