import jwt from "jsonwebtoken";
const requireAuth = async (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1] + "";
  console.log(token, "token auth")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "token")
    req.admin = decoded;
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default requireAuth;
