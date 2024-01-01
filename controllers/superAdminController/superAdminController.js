import adminModel from "../../models/superAdminModel.js";
const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const check = await bcrypt.compare(password, process.env.SUPER_PW);
    if (email !== process.env.SUPER_EMAIL || !check) {
      return res
        .status(400)
        .json({ message: "Please enter valid credentials" });
    }
    // const superAdmin = await superAdminModel.find({ email });

    // const token = createToken(superAdmin._id);
    res.status(200).json({ user: { email: process.env.SUPER_EMAIL }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { superAdminLogin };
