const passport = require('passport');
const localStrategy = require('../middlewares/strategies/local.js');
const googleStrategy = require('../middlewares/strategies/google.js');
const jwtStrategy = require('../middlewares/strategies/jwt.js');

passport.use(localStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
