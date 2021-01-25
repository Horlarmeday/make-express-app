import sendEmail from '../helpers/mail';

const Agenda = require('agenda');

let connectionOpts;
if (process.env.NODE_ENV === 'test') {
  connectionOpts = { db: { address: process.env.TEST_DATABASE_URL, collection: 'agendaJobs' } };
} else connectionOpts = { db: { address: process.env.DATABASE_URL, collection: 'agendaJobs' } };

const agenda = new Agenda(connectionOpts);

agenda
  .on('ready', () => console.log('Agenda started!'))
  .on('error', () => console.log('Agenda connection error!'));

agenda.define(Constant.SEND_REGISTRATION_EMAIL, async job => {
  const { email } = job.attrs.data;
  await sendEmail(email);
});

agenda.start().then(r => console.log(r)); // Returns a promise, which should be handled appropriately


module.exports = agenda;
