var express = require('express');
var router = express.Router();
const userController = require('../modules/user/userController');
const authMiddleware = require('../middlewares/auth');

router.get('/', function (req, res, next) {
   res.render('index', { title: 'Vídeos Curtos e Engajadores' });
});

router.get('/register', (req, res) => {
   res.render('register', { title: 'Criar Conta' });
});

router.post('/register', userController.register);

router.get('/login', (req, res) => {
   res.render('login', { title: 'Entrar' });
});

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/feed', authMiddleware, (req, res) => {
   res.render('home', { user: req.session.user });
});

module.exports = router;