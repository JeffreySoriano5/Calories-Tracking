import session from "express-session";
import passport from 'passport/lib';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);

export default function (app) {
  app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({mongooseConnection: mongoose.connection}),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const User = mongoose.model('User');

  passport.use(User.createStrategy());

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  return app;
}
