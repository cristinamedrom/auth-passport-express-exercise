const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const username = req.user.username;
        return res.redirect(`/profile/${username}`);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.render('error', { message: 'Error al obtener el perfil del usuario' });
    }
});

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                posts: true,
            },
        });

        if (!user) {
            return res.status(404).render('error', { message: 'Usuario no encontrado' });
        }

        res.render('profile', { title: `Perfil de ${user.username}`, user });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.render('error', { message: 'Error al obtener el perfil del usuario' });
    }
});

module.exports = router;