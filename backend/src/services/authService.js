const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { prisma } = require("../config/prisma");
const { HttpError } = require("../utils/httpError");

const BCRYPT_SALT_ROUNDS = 12;
const TOKEN_EXPIRES_IN = "7d";
const GOOGLE_PROVIDER = "google";
const LOCAL_PROVIDER = "local";

const googleClient = new OAuth2Client();

const getJwtSecret = () => {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required for authentication");
  }

  return env.JWT_SECRET;
};

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

const generateToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    getJwtSecret(),
    {
      expiresIn: TOKEN_EXPIRES_IN
    }
  );

const getGoogleClientId = () => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new HttpError(500, "Google authentication is not configured");
  }

  return env.GOOGLE_CLIENT_ID;
};

const getNameFromGooglePayload = (payload) => {
  const trimmedName = typeof payload.name === "string" ? payload.name.trim() : "";

  if (trimmedName) {
    return trimmedName.slice(0, 120);
  }

  return payload.email.split("@")[0].slice(0, 120);
};

const verifyGoogleCredential = async (credential) => {
  const audience = getGoogleClientId();
  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience
    });
  } catch (_error) {
    throw new HttpError(401, "Invalid Google credential");
  }

  const payload = ticket.getPayload();

  if (
    !payload ||
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    payload.email_verified !== true
  ) {
    throw new HttpError(401, "Invalid Google credential");
  }

  return {
    email: payload.email.trim().toLowerCase(),
    name: getNameFromGooglePayload(payload),
    providerId: payload.sub
  };
};

const createDefaultSettings = async (tx, userId) => {
  await tx.userSettings.create({
    data: {
      userId
    }
  });
};

const buildAuthResponse = (user) => ({
  token: generateToken(user),
  user: toSafeUser(user)
});

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (existingUser) {
    throw new HttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          provider: LOCAL_PROVIDER
        },
        select: {
          id: true
        }
      });

      await createDefaultSettings(tx, user.id);
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new HttpError(409, "Email is already registered");
    }

    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  if (!user.passwordHash) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    token: generateToken(user),
    user: toSafeUser(user)
  };
};

const findGoogleLinkedUser = (tx, providerId) =>
  tx.user.findFirst({
    where: {
      provider: GOOGLE_PROVIDER,
      providerId
    }
  });

const linkExistingUserToGoogle = async (tx, user, googleIdentity) => {
  if (user.providerId && user.providerId !== googleIdentity.providerId) {
    throw new HttpError(403, "Google account does not match linked account");
  }

  return tx.user.update({
    where: {
      id: user.id
    },
    data: {
      provider: GOOGLE_PROVIDER,
      providerId: googleIdentity.providerId
    }
  });
};

const createGoogleUser = async (tx, googleIdentity) => {
  const user = await tx.user.create({
    data: {
      name: googleIdentity.name,
      email: googleIdentity.email,
      provider: GOOGLE_PROVIDER,
      providerId: googleIdentity.providerId
    }
  });

  await createDefaultSettings(tx, user.id);

  return user;
};

const loginWithGoogle = async ({ credential }) => {
  const googleIdentity = await verifyGoogleCredential(credential);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const linkedUser = await findGoogleLinkedUser(tx, googleIdentity.providerId);

      if (linkedUser) {
        return linkedUser;
      }

      const existingEmailUser = await tx.user.findUnique({
        where: {
          email: googleIdentity.email
        }
      });

      if (existingEmailUser) {
        return linkExistingUserToGoogle(tx, existingEmailUser, googleIdentity);
      }

      return createGoogleUser(tx, googleIdentity);
    });

    return buildAuthResponse(user);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error.code === "P2002") {
      throw new HttpError(409, "Google account is already linked");
    }

    throw error;
  }
};

const verifyToken = (token) => {
  const jwtSecret = getJwtSecret();
  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (_error) {
    throw new HttpError(401, "Invalid or expired token");
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string"
  ) {
    throw new HttpError(401, "Invalid or expired token");
  }

  return {
    userId: payload.userId,
    email: payload.email
  };
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  if (!user) {
    throw new HttpError(401, "Invalid or expired token");
  }

  return user;
};

module.exports = {
  getUserById,
  loginWithGoogle,
  loginUser,
  registerUser,
  verifyToken
};
