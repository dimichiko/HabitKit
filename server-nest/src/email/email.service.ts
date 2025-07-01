import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"LifeHub" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  // Template para correo de bienvenida
  getWelcomeEmailTemplate(userName: string): EmailTemplate {
    return {
      subject: '¡Bienvenido a LifeHub! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a LifeHub</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido a LifeHub!</h1>
              <p>Tu plataforma integral para organizar tu vida</p>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              <p>Nos alegra mucho que te hayas unido a LifeHub. Estamos aquí para ayudarte a organizar tu vida de manera más eficiente.</p>
              
              <h3>🚀 ¿Qué puedes hacer con LifeHub?</h3>
              <ul>
                <li><strong>HabitKit:</strong> Construye hábitos positivos y rastrea tu progreso</li>
                <li><strong>CalorieKit:</strong> Controla tu nutrición y alcanza tus objetivos</li>
                <li><strong>InvoiceKit:</strong> Gestiona facturas y clientes profesionalmente</li>
                <li><strong>TrainingKit:</strong> Planifica y registra tus entrenamientos</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Comenzar ahora</a>
              </p>
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos en <a href="mailto:soporte@lifehub.app">soporte@lifehub.app</a></p>
            </div>
            <div class="footer">
              <p>© 2024 LifeHub. Todos los derechos reservados.</p>
              <p>Este email fue enviado a tu dirección de correo electrónico.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ¡Bienvenido a LifeHub!
        
        Hola ${userName},
        
        Nos alegra mucho que te hayas unido a LifeHub. Estamos aquí para ayudarte a organizar tu vida de manera más eficiente.
        
        ¿Qué puedes hacer con LifeHub?
        - HabitKit: Construye hábitos positivos y rastrea tu progreso
        - CalorieKit: Controla tu nutrición y alcanza tus objetivos
        - InvoiceKit: Gestiona facturas y clientes profesionalmente
        - TrainingKit: Planifica y registra tus entrenamientos
        
        Comienza ahora: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
        
        Si tienes alguna pregunta, contacta: soporte@lifehub.app
        
        © 2024 LifeHub. Todos los derechos reservados.
      `
    };
  }

  // Template para verificación de email
  getVerificationEmailTemplate(userName: string, token: string): EmailTemplate {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    return {
      subject: 'Verifica tu cuenta de LifeHub ✨',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifica tu cuenta</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Verifica tu cuenta</h1>
              <p>Un paso más para comenzar con LifeHub</p>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              <p>Gracias por registrarte en LifeHub. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.</p>
              
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
              </p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad.
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
            </div>
            <div class="footer">
              <p>© 2024 LifeHub. Todos los derechos reservados.</p>
              <p>Este email fue enviado a tu dirección de correo electrónico.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Verifica tu cuenta de LifeHub
        
        ¡Hola ${userName}!
        
        Gracias por registrarte en LifeHub. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.
        
        Verifica tu cuenta: ${verificationUrl}
        
        ⚠️ Importante: Este enlace expirará en 24 horas por seguridad.
        
        Si no creaste esta cuenta, puedes ignorar este email.
        
        © 2024 LifeHub. Todos los derechos reservados.
      `
    };
  }

  // Template para reset de contraseña
  getPasswordResetEmailTemplate(userName: string, token: string): EmailTemplate {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    return {
      subject: 'Restablece tu contraseña de LifeHub 🔐',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablece tu contraseña</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Restablece tu contraseña</h1>
              <p>Recupera el acceso a tu cuenta</p>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de LifeHub.</p>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer contraseña</a>
              </p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #e74c3c;">${resetUrl}</p>
              
              <p>Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña permanecerá sin cambios.</p>
            </div>
            <div class="footer">
              <p>© 2024 LifeHub. Todos los derechos reservados.</p>
              <p>Este email fue enviado a tu dirección de correo electrónico.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Restablece tu contraseña de LifeHub
        
        ¡Hola ${userName}!
        
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de LifeHub.
        
        Restablecer contraseña: ${resetUrl}
        
        ⚠️ Importante: Este enlace expirará en 1 hora por seguridad.
        
        Si no solicitaste este cambio, puedes ignorar este email.
        
        © 2024 LifeHub. Todos los derechos reservados.
      `
    };
  }

  // Template para confirmación de 2FA
  getTwoFactorEmailTemplate(userName: string, code: string): EmailTemplate {
    return {
      subject: 'Código de verificación 2FA - LifeHub 🔒',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Código 2FA</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Código de verificación</h1>
              <p>Autenticación de dos factores</p>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              <p>Has solicitado un código de verificación para tu cuenta de LifeHub.</p>
              
              <div class="code">${code}</div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este código expirará en 10 minutos por seguridad.
              </div>
              
              <p>Si no solicitaste este código, contacta inmediatamente con soporte.</p>
            </div>
            <div class="footer">
              <p>© 2024 LifeHub. Todos los derechos reservados.</p>
              <p>Este email fue enviado a tu dirección de correo electrónico.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Código de verificación 2FA - LifeHub
        
        ¡Hola ${userName}!
        
        Has solicitado un código de verificación para tu cuenta de LifeHub.
        
        Tu código es: ${code}
        
        ⚠️ Importante: Este código expirará en 10 minutos por seguridad.
        
        Si no solicitaste este código, contacta inmediatamente con soporte.
        
        © 2024 LifeHub. Todos los derechos reservados.
      `
    };
  }

  // Template para actualización de plan
  getPlanUpdateEmailTemplate(userName: string, newPlan: string): EmailTemplate {
    return {
      subject: `Plan actualizado a ${newPlan} - LifeHub 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Plan actualizado</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f39c12; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Plan actualizado!</h1>
              <p>Disfruta de todas las nuevas funcionalidades</p>
            </div>
            <div class="content">
              <h2>¡Hola ${userName}!</h2>
              <p>¡Excelente noticia! Tu plan ha sido actualizado exitosamente a <strong>${newPlan}</strong>.</p>
              
              <h3>🚀 Nuevas funcionalidades disponibles:</h3>
              <ul>
                <li>Acceso a más aplicaciones</li>
                <li>Historial completo de datos</li>
                <li>Copias de seguridad automáticas</li>
                <li>Sin anuncios</li>
                <li>Soporte prioritario</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/apps" class="button">Explorar aplicaciones</a>
              </p>
              
              <p>¡Gracias por confiar en LifeHub!</p>
            </div>
            <div class="footer">
              <p>© 2024 LifeHub. Todos los derechos reservados.</p>
              <p>Este email fue enviado a tu dirección de correo electrónico.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Plan actualizado a ${newPlan} - LifeHub
        
        ¡Hola ${userName}!
        
        ¡Excelente noticia! Tu plan ha sido actualizado exitosamente a ${newPlan}.
        
        Nuevas funcionalidades disponibles:
        - Acceso a más aplicaciones
        - Historial completo de datos
        - Copias de seguridad automáticas
        - Sin anuncios
        - Soporte prioritario
        
        Explorar aplicaciones: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/apps
        
        ¡Gracias por confiar en LifeHub!
        
        © 2024 LifeHub. Todos los derechos reservados.
      `
    };
  }
} 