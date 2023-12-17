const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username },
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return done(null, false, { message: 'Nombre de usuario o contraseña incorrectos' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;