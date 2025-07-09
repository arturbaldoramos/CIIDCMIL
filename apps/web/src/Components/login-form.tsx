"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom" // Passo 1: Importe o hook
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useVerification } from "@/context/VerificationProvider"


const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
})

type LoginFormValues = z.infer<typeof LoginFormSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [alertMessage, setAlertMessage] = useState<{ type: "error" | null; message: string | null } | null>(null)
  const { openModal } = useVerification();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setAlertMessage(null); // Limpa alertas antigos ao submeter
    try {
      // Usando o cliente Axios global que configuramos
      const response = await fetch("http://localhost:3000/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'EMAIL_NOT_VERIFIED') {
          openModal(values.email);
        } else {
          setAlertMessage({ type: "error", message: data.message || "Ocorreu um erro inesperado." });
        }
        return; // Interrompe a execução aqui em caso de erro
      }

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        
        navigate("/dashboard"); 

      } else {
        setAlertMessage({ type: "error", message: "Token de acesso não recebido. Tente novamente." });
      }

    } catch (error: any) {
      console.error("Erro no login:", error.message)
      setAlertMessage({ type: "error", message: "Não foi possível conectar ao servidor. Tente novamente." })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                  <p className="text-muted-foreground text-balance">
                    Acesse sua conta para continuar
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@exemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                          Esqueceu sua senha?
                        </a>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {alertMessage && alertMessage.type === 'error' && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>
                      {alertMessage.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
                <div className="text-center text-sm">
                  Não tem uma conta?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Registrar
                  </a>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-muted relative hidden md:block ">
            <img
              src="/logo_proto.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}