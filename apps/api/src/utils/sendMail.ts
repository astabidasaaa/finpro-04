import { FRONTEND_URL, NODEMAILER_EMAIL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';

export const registrationMail = async (email: string, token: string) => {
  const registrationLink = `${FRONTEND_URL}/registrasi/konfirmasi?token=${token}`;

  const templatePath = path.join(
    __dirname,
    '../templates',
    'registrationMail.hbs',
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(templateSource);

  const html = compiledTemplate({
    registrationLink,
  });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Selamat Datang di Sigmart',
    html,
  });
};

export const verificationMail = async (email: string, token: string) => {
  const verifyLink = `${FRONTEND_URL}/verifikasi-email?token=${token}`;

  const templatePath = path.join(
    __dirname,
    '../templates',
    'verificationMail.hbs',
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(templateSource);

  const html = compiledTemplate({
    verifyLink,
  });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Verifikasi Email - SIGMART',
    html,
  });
};

export const resetPasswordMail = async (email: string, token: string) => {
  const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  const templatePath = path.join(
    __dirname,
    '../templates',
    'resetPasswordMail.hbs',
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(templateSource);

  const html = compiledTemplate({
    resetPasswordLink,
  });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Permintaan atur ulang password - SIGMART',
    html,
  });
};
