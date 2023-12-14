const express = require('express');
const app = express();
const PORT = 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const helpers = require('./utils/helpers');
const hbs = exphbs.create({
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
    },
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.engine('hbs', exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: require('./utils/helpers')
}).engine);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/sign-up');
const profileRouter = require('./routes/profile');
const foroRouter = require('./routes/foro');

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/profile', profileRouter);
app.use('/foro', foroRouter);

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
