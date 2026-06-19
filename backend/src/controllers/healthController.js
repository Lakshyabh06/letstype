const getHealth = (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "letstype-backend"
  });
};

module.exports = {
  getHealth
};
