const {
  loginUser,
  loginWithGoogle,
  registerUser
} = require("../services/authService");

const register = async (req, res, next) => {
  try {
    await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const result = await loginWithGoogle(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  getMe,
  googleLogin,
  login,
  register
};
