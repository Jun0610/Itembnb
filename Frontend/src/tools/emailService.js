import emailjs from '@emailjs/browser';

const service_id = 'service_44uw7yq';
const template_id = 'template_88gvtrr';
const public_key = 'GOFeOE5aTFGzBv1A2';

class EmailService {
    static sendEmail(sender, receiver, msg) {
        const body = {
            to_name: receiver.name,
            from_name: sender.user.user.name,
            reply_to: sender.user.user.email,
            message: msg,
            to_email: receiver.email,
          }
          emailjs.send(service_id, template_id, body, public_key).then((result) => {
            console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
    }
}

export default EmailService;