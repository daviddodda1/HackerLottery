const User = require('../models/Admin');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const userName = req.body.name;
  const userPassword = req.body.password;

  resData = {
    success: false,
    data: {},
    message: '',
  };

  try {
    const Admin = await User.findOne({ 'auth.name': userName });
    if (Admin && Admin.auth.password === userPassword) {
      const tokenData = {
        name: Admin.auth.name,
        id: Admin._id,
      };
      const jwtToken = await jwt.sign(tokenData, 'test_string', {
        algorithm: 'HS256',
      });
      resData.success = true;
      resData.data = { jwt: jwtToken };
      resData.message = 'Login successful';
      res.cookie('token', jwtToken, { maxAge: 900000, httpOnly: true });
    } else {
      resData.message = 'Login error';
    }
  } catch (e) {
    resData.message = e.message;
  }
  res.send(resData);
};

module.exports = {
  login,
};
