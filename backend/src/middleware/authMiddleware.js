const { getUserById, verifyToken } = require("../services/authService");
const { HttpError } = require("../utils/httpError");

const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const requireAuth = async (req, _res, next) => {
  try {
    const token = getTokenFromHeader(req.get("Authorization"));

    if (!token) {
      throw new HttpError(401, "Authentication token is required");
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireAuth
};
