import Constant from '../config/constants'

const agenda = require('./agenda');


export async function sendWelcomeEmail(content, user) {
  await agenda.schedule('in 30 seconds', Constant.SEND_REGISTRATION_EMAIL, {
    content,
    user,
  });
}
