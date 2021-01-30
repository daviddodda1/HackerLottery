var express = require('express');
var router = express.Router();
const loginService = require('../services/login');
const lobbyService = require('../services/lobby');

/* GET users listing. */
router.post('/login', function (req, res, next) {
  loginService.login(req, res);
});

router.get('/lobby', (req, res, next) => {
  lobbyService.getLobbies(req, res);
});

router.post('/lobby', (req, res, next) => {
  lobbyService.addLobby(req, res);
});

router.post('/lobby/user', (req, res, next) => {
  lobbyService.addUser(req, res);
});

router.post('/lobby/drawWinner', (req, res, next) => {
  lobbyService.drawWinner(req, res);
});

module.exports = router;
