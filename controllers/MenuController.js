import menuModel from "../models/MenuModel.js";

const createMenu = async (req, res) => {
  const { id: adminid } = req.admin;
  const { items } = req.body;

  try {
    const newMenu = new menuModel({ adminid, items });
    const savedMenu = await newMenu.save();

    res.status(201).json(savedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const updatedMenu = await menuModel.findByIdAndUpdate(
      { _id: id, "items._id": req.body.id },
      { $set: { items } },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getmenu = async (req, res) => {
  console.log(req.user);
  console.log(req.admin);
  const menu = await menuModel.findOne({ adminid: req.admin.id });
  res.status(200).json({ menu });
};
const deletedata = async (req, res) => {
  const menu = await menuModel.findOne({ _id: req.params.id });
  res.status(200).json({ menu });
};

export { updateMenu, getmenu, deletedata, createMenu };
