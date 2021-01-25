import mongoose from 'mongoose';
import winston from 'winston';

class Connection {
  constructor() {
    let url;
    if (process.env.NODE_ENV === 'test') {
      url = process.env.TEST_DATABASE_URL;
    } else url = process.env.DATABASE_URL;
    // eslint-disable-next-line no-console
    console.log(`Established ${url} connection`);
    mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('retryWrites', false);
    mongoose.connect(url).then(() => winston.info(`Connected to ${url}`));
  }
}

export default new Connection();
