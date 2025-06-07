"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"

import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form"

import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"


// Schema de Validação com Zod
const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
})

// Defina os tipos de dados esperados para o formulário
type LoginFormValues = z.infer<typeof LoginFormSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error" | null; message: string | null } | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        // Define o alerta de erro
        setAlertMessage({ type: "error", message: errorData.message || "Ocorreu um erro inesperado ao tentar fazer login." });
        return; // Retorna para não continuar no fluxo de sucesso
      }

      // Se a resposta for OK, define o alerta de sucesso
      const data = await response.json()
      console.log("Login bem-sucedido:", data);
      setAlertMessage({ type: "success", message: "Login realizado com sucesso!" });

      // Limpa os campos de email e senha após o login bem-sucedido
      form.reset({
        email: "",
        password: "",
      });

    } catch (error: any) {
      // Este catch pegará erros de rede ou outros erros que não vêm da resposta da API
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

                {/* Campo de Email */}
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

                {/* Campo de Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Esqueceu sua senha?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Renderiza o Alert se houver uma mensagem */}
                {alertMessage && (
                  <Alert variant={alertMessage.type === "error" ? "destructive" : "default"}>
                    {alertMessage.type === "error" ? <ExclamationTriangleIcon className="h-4 w-4" /> : <CheckCircledIcon className="h-4 w-4" />}
                    <AlertTitle>{alertMessage.type === "error" ? "Erro!" : "Sucesso!"}</AlertTitle>
                    <AlertDescription>
                      {alertMessage.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Entrar
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

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
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