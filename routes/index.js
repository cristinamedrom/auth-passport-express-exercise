const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Iniciar sesión' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true,
}));

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión', err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

module.exports = router;
