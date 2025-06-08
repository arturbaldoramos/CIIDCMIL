import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVerification } from '@/context/VerificationProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/Components/ui/input-otp';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';

const OTPSchema = z.object({ code: z.string().min(6, { message: 'O código deve ter 6 dígitos.' }) });

export const VerificationDialog = () => {
  const { isOpen, closeModal, verificationEmail } = useVerification();
  const [isResending, setIsResending] = useState(false);
  
  // Passo 1: Estado para controlar a mensagem do Alert
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const navigate = useNavigate();

  const form = useForm<{ code: string }>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { code: '' },
  });

  const handleResendCode = async () => {
    if (!verificationEmail) return;
    setIsResending(true);
    setAlertMessage(null); // Limpa alertas antigos
    try {
      await api.post('/auth/resend-code', { email: verificationEmail });
      // Usa o Alert do ShadCN em vez do alert() do navegador
      setAlertMessage({ type: 'success', message: 'Um novo código foi enviado para o seu e-mail.' });
    } catch (error) {
      console.error("Erro ao reenviar código", error);
      setAlertMessage({ type: 'error', message: 'Não foi possível reenviar o código. Tente novamente mais tarde.' });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: { code: string }) => {
    if (!verificationEmail) return;
    setAlertMessage(null); // Limpa alertas antigos
    try {
      const response = await api.post('/auth/verify-email', { email: verificationEmail, code: data.code });
      //alert(response.data.message); // Mantemos um alerta de sucesso final antes de sair
      closeModal();
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao verificar.';
      // Usa o Alert do ShadCN para exibir o erro
      setAlertMessage({ type: 'error', message: errorMessage });
    }
  };

  return (
    // O onOpenChange agora só é chamado programaticamente via closeModal()
    <Dialog open={isOpen} onOpenChange={isOpen ? () => {} : closeModal}>
      <DialogContent 
        // Passo 2: Adiciona as props para "travar" o dialog
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Verifique seu E-mail</DialogTitle>
          <DialogDescription>
            Enviamos um código para <strong>{verificationEmail}</strong>. Insira-o abaixo para continuar.
          </DialogDescription>
        </DialogHeader>

        {/* Renderização condicional do Alert */}
        {alertMessage && (
          <Alert variant={alertMessage.type === "error" ? "destructive" : "default"}>
            {alertMessage.type === "error" ? <ExclamationTriangleIcon className="h-4 w-4" /> : <CheckCircledIcon className="h-4 w-4" />}
            <AlertDescription>
              {alertMessage.message}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control} name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Código de Verificação</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                        <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Verificar Conta
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Não recebeu o código?{' '}
          <Button variant="link" onClick={handleResendCode} disabled={isResending} className="p-0 h-auto">
            {isResending ? 'Reenviando...' : 'Reenviar código'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};