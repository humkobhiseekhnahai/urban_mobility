const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: profile.id },
          { email }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email,
          googleId: profile.id,
          roleSelected: false
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.id }
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
