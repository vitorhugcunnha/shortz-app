var express = require('express');
var router = express.Router();

/* requisacao GET para a home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// requisicao GET para registro formulario de registro

router.get('/register', function(req, res, next) {
  res.render('register');
} );


module.exports = router;
