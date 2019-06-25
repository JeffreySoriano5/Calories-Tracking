import mongoose from 'mongoose';

//import only wanted to create model instances for the first time
import User from './user'; //eslint-disable-line
import Meal from './meal'; //eslint-disable-line

const connectDb = () => {
  const connection = mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
  mongoose.set('useCreateIndex', true);
  mongoose.set('debug', process.env.NODE_ENV === 'development');

  return connection;
};

export {connectDb};
