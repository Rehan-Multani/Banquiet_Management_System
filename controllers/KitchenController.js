import menuModel from "../models/MenuModel.js";
const updateKitchen = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const updatedMenuPromises = items.map(async (item) => {
      const updatedMenu = await menuModel.findOneAndUpdate(
        { _id: id, "items._id": item._id },
        {
          $set: {
            "items.$.weight": item.weight,
            "items.$.kitchenid": item.kitchenid,
            "items.$.rating": item.rating || null,
            "items.$.last_update_kitchen": new Date().toString(),
          },
        },
        { new: true }
      );

      return updatedMenu;
    });

    const updatedMenus = await Promise.all(updatedMenuPromises);

    if (updatedMenus.every((menu) => menu !== null)) {
      res.json(updatedMenus);
    } else {
      return res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { updateKitchen };

export { updateKitchen };
