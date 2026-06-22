import { Resend } from 'resend';

export const getMailer = (user, pass) => {
  const resendApiKey = process.env.RESEND_API_KEY || '';
  const resend = new Resend(resendApiKey);

  return {
    sendMail: async (options) => {
      // Enforce the verified domain as the sender. 
      // If the domain is imazenstudios.com, the from MUST end in @imazenstudios.com
      const fromEmail = 'info@imazenstudios.com';
      const fromName = 'Imazen Studios';
      const formattedFrom = `${fromName} <${fromEmail}>`;

      // Handle multiple recipients (Nodemailer uses comma separated string, Resend prefers array)
      let toArray = [];
      if (Array.isArray(options.to)) {
        toArray = options.to;
      } else if (typeof options.to === 'string') {
        toArray = options.to.split(',').map(e => e.trim()).filter(e => e);
      } else {
        toArray = [options.to];
      }

      if (toArray.length === 0) {
        throw new Error('No valid recipients provided');
      }

      const resendOptions = {
        from: formattedFrom,
        to: toArray,
        subject: options.subject,
      };

      if (options.text) resendOptions.text = options.text;
      if (options.html) resendOptions.html = options.html;
      if (options.replyTo) resendOptions.reply_to = options.replyTo;

      if (!resendApiKey) {
        console.warn('RESEND_API_KEY is not set. Simulating success for:', options.subject);
        return { messageId: 'simulated-id' };
      }

      const { data, error } = await resend.emails.send(resendOptions);

      if (error) {
        console.error('Resend Error:', error);
        throw new Error(error.message || 'Failed to send email via Resend');
      }

      return { messageId: data.id };
    }
  };
};
