import { FRONTEND_URL, NODEMAILER_EMAIL } from '@/config';
import { transporter } from '@/libs/nodemailer';

export const registrationMail = async (email: string, token: string) => {
  const registrationLink = `${FRONTEND_URL}/registrasi/konfirmasi?token=${token}`;

  // const templatePath = path.join(
  //   __dirname,
  //   '../templates',
  //   'emailVerification.hbs',
  // );
  // const templateSource = fs.readFileSync(templatePath, 'utf-8');

  // const compiledTemplate = handlebars.compile(templateSource);

  // const html = compiledTemplate({
  //   action_url: registrationLink,
  //   support_url: 'https://example.com',
  // });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Registrasi Sigmart',
    html: `<p>Konfirmasi email dan masukkan password  <a href="${registrationLink}">di sini</a></p>`,
  });
};

export const verificationMail = async (email: string, token: string) => {
  const verifyLink = `${FRONTEND_URL}/verifikasi-email?token=${token}`;

  // const templatePath = path.join(
  //   __dirname,
  //   '../templates',
  //   'emailVerification.hbs',
  // );
  // const templateSource = fs.readFileSync(templatePath, 'utf-8');

  // const compiledTemplate = handlebars.compile(templateSource);

  // const html = compiledTemplate({
  //   action_url: verifyLink,
  //   support_url: 'https://example.com',
  // });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Verifikasi email',
    html: `<h1>Selamat bergabung dengan Sigmart!</h1><p>Terima kasih telah menggunakan Sigmart. Untuk menggunakan fitur belanja, silakan verifikasi email anda</p><p>Verifikasi email anda <a href="${verifyLink}">di sini</a></p>`,
  });
};

export const resetPasswordMail = async (email: string, token: string) => {
  const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  // const templatePath = path.join(
  //   __dirname,
  //   '../templates',
  //   'emailVerification.hbs',
  // );
  // const templateSource = fs.readFileSync(templatePath, 'utf-8');

  // const compiledTemplate = handlebars.compile(templateSource);

  // const html = compiledTemplate({
  //   action_url: resetPasswordLink,
  //   support_url: 'https://example.com',
  // });

  await transporter.sendMail({
    from: NODEMAILER_EMAIL,
    to: email,
    subject: 'Permintaan atur ulang password',
    html: `<h1>Permintaan atur ulang password</h1><p>Atur ulang password akun anda <a href="${resetPasswordLink}">di sini</a></p>`,
  });
};
