import mongoose from 'mongoose';

//import only wanted to create model instances for the first time
import User from './user'; //eslint-disable-line

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

export {connectDb};
