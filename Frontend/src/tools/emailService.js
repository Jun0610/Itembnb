import emailjs from '@emailjs/browser';

const service_id = 'service_44uw7yq';
const template_id_redirection = 'template_88gvtrr';
const template_id_no_redirection = 'template_rafcnub';
const template_id_borrow = 'template_wxzleqy';
const public_key = 'GOFeOE5aTFGzBv1A2';

class EmailService {
  static async sendEmailNoRedirection(sender, receiver, msg) {
    const body = {
      to_name: receiver.name,
      from_name: sender.user.user.name,
      reply_to: sender.user.user.email,
      message: msg,
      to_email: receiver.email,
    }
    await emailjs.send(service_id, template_id_no_redirection, body, public_key).then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  }

  static async sendEmailRedirection(sender, receiver, msg, url) {
    const body = {
      to_name: receiver.name,
      from_name: sender.user.user.name,
      reply_to: sender.user.user.email,
      message: msg,
      url: url,
      to_email: receiver.email,
    }
    await emailjs.send(service_id, template_id_redirection, body, public_key).then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  }

  static async sendEmailBorrow(receiver, msg, url) {
    const body = {
      to_name: receiver.name,
      from_name: 'itembnb2@gmail.com',
      reply_to: 'itembnb2@gmail.com',
      message: msg,
      url: url,
      to_email: receiver.email,
    }
    await emailjs.send("service_lcfvcdt", template_id_borrow, body, "YwauSsCn8seDPn2UJ").then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
  }
}

export default EmailService;