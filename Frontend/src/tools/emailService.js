import emailjs from '@emailjs/browser';

const service_id = 'service_44uw7yq';
const template_id = 'template_88gvtrr';
const public_key = 'GOFeOE5aTFGzBv1A2';

class EmailService {
    static sendEmail(authUser, borrower, msg) {
        const body = {
            to_name: borrower.name,
            from_name: authUser.user.user.name,
            reply_to: authUser.user.user.email,
            message: msg,
            to_email: borrower.email,
          }
          emailjs.send(service_id, template_id, body, public_key).then((result) => {
            console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
    }
}

export default EmailService;