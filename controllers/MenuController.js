import menuModel from "../models/MenuModel.js";

const createMenu = async (req, res) => {
  const { id: adminid } = req.admin;
  const { items, date_from, date_to } = req.body;

  try {
    const result = await menuModel.find({
      $or: [
        {
          $and: [
            { date_from: { $lte: date_from } },
            { date_to: { $gte: date_from } },
          ],
        },
        {
          $and: [
            { date_from: { $lte: date_to } },
            { date_to: { $gte: date_to } },
          ],
        },
      ],
    });
    if (result.length > 0) {
      return res
        .status(500)
        .json({ message: "Menu already exists in the time frame." });
    }
    const newMenu = new menuModel({
      adminid,
      items: JSON.parse(items),
      date_from,
      date_to,
    });
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
      { _id: id },
      { $set: { items: JSON.parse(items) } },
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

const getMenu = async (req, res) => {
  console.log(req.user);
  console.log(req.admin);
  const Menu = await menuModel.findOne({ adminid: req.admin.id });
  res.status(200).json({ Menu });
};

function isDateBetween(targetDate, startDate, endDate) {
  // Convert string dates to JavaScript Date objects
  targetDate = new Date(targetDate);
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Check if the target date is greater than or equal to the start date
  // and less than or equal to the end date
  return targetDate >= startDate && targetDate <= endDate;
}

const getMenuall = async (req, res) => {
  const { date } = req.params;
  const menu = await menuModel.find();
  console.log(menu);
  const finalMenu = menu.find((el) =>
    isDateBetween(date, el.date_from, el.date_to)
  );
  console.log(finalMenu);
  res.status(200).json({ menu: { finalMenu } });
};
const deleteMenu = async (req, res) => {
  const Menu = await menuModel.findOne({ _id: req.params.id });
  res.status(200).json({ Menu });
};

export { updateMenu, getMenu, deleteMenu, createMenu, getMenuall };
