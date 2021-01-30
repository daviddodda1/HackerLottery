const User = require('../models/Admin');
const Lobby = require('../models/lobby');
const jwt = require('jsonwebtoken');

const getLobbies = async (req, res) => {
  const cookie = req.cookies.jwt_token;
  console.log(cookie);
  resData = {
    success: false,
    data: {},
    message: '',
  };

  try {
    const tokenData = await jwt.verify(cookie, 'test_string');
    console.log(tokenData);
    const dataToSend = {
      houseEarnings: 0,
      Lobby: [],
    };

    const userData = await User.findOne({ _id: tokenData.id });
    dataToSend.houseEarnings = userData.houseEarnings;
    const lobbyData = await Lobby.find({}).sort({ _id: -1 });
    lobbyData.forEach((lobby) => {
      const tempData = {
        name: lobby.name,
        maxNumber: lobby.maxNumUsers,
        userNumber: lobby.users.length,
        amount: lobby.entryFee,
        winner: lobby.winner,
        id: lobby._id,
        userList: lobby.users,
        priceMoney: lobby.priceMoney,
      };
      dataToSend.Lobby.push(tempData);
    });
    resData.success = true;
    resData.data = dataToSend;
    resData.message = 'Got Lobby Data';
  } catch (e) {
    resData.message = e.message;
  }
  res.send(resData);
};

const addLobby = async (req, res) => {
  const cookie = req.cookies.jwt_token;
  console.log(cookie);
  resData = {
    success: false,
    data: {},
    message: '',
  };

  try {
    const tokenData = await jwt.verify(cookie, 'test_string');
    console.log(tokenData);
    const lobbyName = req.body.name;
    const maxUsers = req.body.maxUsers;
    const entryFee = req.body.entryFee;

    const newLobby = await Lobby.create({
      name: lobbyName,
      maxNumUsers: parseInt(maxUsers),
      entryFee: parseInt(entryFee),
      winner: '',
      users: [],
      priceMoney: 0,
    });

    resData.success = true;
    resData.data = newLobby;
    resData.message = 'lobby created successfully';
  } catch (e) {
    resData.message(e.message);
  }
  res.send(resData);
};

const addUser = async (req, res) => {
  const cookie = req.cookies.jwt_token;
  console.log(cookie);
  resData = {
    success: false,
    data: {},
    message: '',
  };

  try {
    const tokenData = await jwt.verify(cookie, 'test_string');
    console.log(tokenData);
    const userName = req.body.name;
    const lobbyID = req.body.id;

    const lobby = await Lobby.findOne({ _id: lobbyID });

    if (lobby) {
      let nameIndex = lobby.users.indexOf(userName);
      if (nameIndex == -1 && lobby.users.length < lobby.maxNumUsers) {
        const pricePool =
          (95 / 100) * lobby.entryFee * (lobby.users.length + 1);
        const finalLobby = await Lobby.findOneAndUpdate(
          { _id: lobbyID },
          {
            $push: { users: userName },
            $set: { priceMoney: pricePool.toFixed(2) },
          },
        );
        resData.success = true;
        resData.data = finalLobby;
        resData.message = 'User added to the lobby successfully';
      } else {
        resData.message =
          'this user is alredy in the lobby or the lobby is full';
      }
    } else {
      resData.message = 'No lobby with this ID';
    }
  } catch (e) {
    resData.message = e.message;
  }
  res.send(resData);
};

const drawWinner = async (req, res) => {
  const cookie = req.cookies.jwt_token;
  console.log(cookie);
  resData = {
    success: false,
    data: {},
    message: '',
  };

  try {
    const tokenData = await jwt.verify(cookie, 'test_string');
    console.log(tokenData);
    const lobbyID = req.body.id;

    const lobby = await Lobby.findOne({ _id: lobbyID });
    const user = await User.findOne({ _id: tokenData.id });
    if (lobby) {
      if (lobby.users.length == lobby.maxNumUsers && lobby.winner == '') {
        const pricePool = (95 / 100) * lobby.entryFee * lobby.users.length;
        const newHouseEarnings =
          (5 / 100) * lobby.entryFee * lobby.users.length;
        const winner =
          lobby.users[Math.floor(Math.random() * lobby.users.length)];
        const finalLobby = await Lobby.findOneAndUpdate(
          { _id: lobbyID },
          {
            $set: { priceMoney: pricePool.toFixed(2), winner: winner },
          },
        );
        const updatedUser = await User.findByIdAndUpdate(
          { _id: tokenData.id },
          { $set: { houseEarnings: user.houseEarnings + newHouseEarnings } },
        );
        resData.success = true;
        resData.data = { winner, pricePool };
        resData.message = 'Winner for the lobby has been picked!';
      } else {
        resData.message =
          'The lobby is wither not full or the winner is already picked.';
      }
    } else {
      resData.message = 'No lobby with this ID';
    }
  } catch (e) {
    resData.message = e.message;
  }
  res.send(resData);
};

module.exports = {
  getLobbies,
  addLobby,
  addUser,
  drawWinner,
};
