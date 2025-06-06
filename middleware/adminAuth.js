module.exports = (req, res, next) => {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken === process.env.ADMIN_TOKEN) {
    return next();
  }
  res.status(403).json({ error: "Admin access required" });
};
