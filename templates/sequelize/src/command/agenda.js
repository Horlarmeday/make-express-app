import { sendMail } from '../helpers/mail'
import Constant from '../config/constants'

const Agenda = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.DB_MONGO, collection: 'jobs' },
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

agenda
  .on('ready', () => console.log('Agenda started!'))
  .on('error', () => console.log('Agenda connection error!'));

agenda.define(Constant.SEND_REGISTRATION_EMAIL, async job => {
  const { content, user } = job.attrs.data;
  await sendMail(content, user);
});

agenda.start().then(r => console.log(r));

module.exports = agenda;