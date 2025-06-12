import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Processor('email') // O nome deve ser o mesmo da fila registrada no módulo
export class EmailProcessor {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    @Process('send-verification-email')
    async handleSendVerificationEmail(job: Job) {
        const { email, name, verificationCode } = job.data;

        await this.mailerService.sendMail({
            to: email,
            from: this.configService.get<string>('MAILER_USER'),
            subject: 'Seu Código de Verificação',
            html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Seu Código de Verificação</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: Arial, sans-serif;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f2f2;">
                <tr>
                  <td align="center">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                      <tr>
                        <td align="center" style="padding: 30px 30px; font-family: Arial, sans-serif;">
                          <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0;">Seja bem-vindo(a)!</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 10px 30px; font-family: Arial, sans-serif;">
                          <p style="font-size: 16px; color: #666666; margin: 0;">Use o código de verificação abaixo para confirmar seu e-mail.</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 20px 30px;">
                          <div style="background-color: #f8f8f8; border: 1px solid #dddddd; border-radius: 8px; padding: 15px 20px; display: inline-block;">
                            <p style="font-size: 32px; font-weight: bold; color: #333333; margin: 0; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                              ${verificationCode}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 30px; font-family: Arial, sans-serif;">
                          <p style="font-size: 12px; color: #999999; margin: 0;">
                            Olá, ${name}! Você recebeu este e-mail porque uma verificação foi solicitada para sua conta. Caso essa solicitação não seja sua, pedimos que ignore este e-mail.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
    }

}