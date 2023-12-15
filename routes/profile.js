const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(401).render('error', { message: 'Debes iniciar sesión para ver tu perfil.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            include: {
                posts: true,
            },
        });

        if (!user) {
            return res.status(404).render('error', { message: 'Usuario no encontrado' });
        }

        res.render('profile', { title: `Perfil de ${user.username}`, user });
    } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
        res.render('error', { message: 'Error al cargar el perfil del usuario' });
    }
});

module.exports = router;
