const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleError = (res, errorMessage) => {
    console.error(errorMessage);
    res.render('error', { message: errorMessage });
};

router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: true,
            },
        });
        res.render('foro', { title: 'Foro', posts });
    } catch (error) {
        console.error('Error al cargar los posts del foro:', error);
        res.render('error', { message: 'Error al cargar los posts del foro' });
    }
});

router.post('/', async (req, res) => {
    const { title, content } = req.body;

    try {
        const currentUser = req.user;

        if (!currentUser) {
            console.log("No has iniciado sesión");
            return res.status(401).render('error', { message: 'Debes iniciar sesión para publicar un post.' });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: currentUser.id,
            },
        });

        res.redirect('/foro');
    } catch (error) {
        handleError(res, 'Error al crear un nuevo post:', error);
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

router.post('/delete/:postId', isAuthenticated, async (req, res) => {
    const postId = req.params.postId;

    try {
        const currentUser = req.user;
        const postToDelete = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!postToDelete || postToDelete.authorId !== currentUser.id) {
            console.log("No puedes eliminar un post que no es tuyo.");
            return res.status(403).render('error', { message: 'No puedes borrar un post que no es tuyo.' });
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        res.redirect('/foro');
    } catch (error) {
        handleError(res, 'Error al borrar el post:', error);
    }
});

module.exports = router;
