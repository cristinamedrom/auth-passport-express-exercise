const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.render('register', { title: 'Registro' });
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.render('register', { error: 'El nombre de usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        req.login(newUser, (err) => {
            if (err) {
                return res.render('register', { error: 'Error al iniciar sesión después del registro' });
            }
            return res.redirect(`/profile/`);
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

module.exports = router;