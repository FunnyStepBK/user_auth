const User = require('../model/User');

const handleLogout = async (req, res) => {
  // ? - On Client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  // Is refresh token in the database?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204); // * - Request was successfully completed but there was no payload attached to the response 
  }

  // Delete the refresh token in the database
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log('Updated users:', result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // ! -> In Production also add => secure: true - only serves on https
  res.sendStatus(204);
}

module.exports = { handleLogout }