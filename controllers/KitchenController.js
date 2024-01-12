import menuModel from "../models/MenuModel.js";
const updateKitchen = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const updatedMenuPromises = items.map(async (item) => {
      // Check if the item is available in req.body
      if (item._id) {
        // Fetch the existing item without updating to retain the old data
        const existingItem = await menuModel.findOne({
          _id: id,
          "items._id": item._id,
        });

        if (!existingItem) {
          return null; // If item not found, return null
        }

        // Update only the fields that are present in req.body
        const updatedFields = {
          "items.$.rating": item.rating || existingItem.items[0].rating,
          "items.$.quantity": item.quantity || existingItem.items[0].quantity,
          "items.$.weight": item.weight || existingItem.items[0].weight,
          "items.$.kitchenid":
            item.kitchenid || existingItem.items[0].kitchenid,
          "items.$.last_update_kitchen": new Date().toString(),
        };

        const updatedMenu = await menuModel.findOneAndUpdate(
          { _id: id, "items._id": item._id },
          { $set: updatedFields },
          { new: true }
        );

        return updatedMenu;
      } else {
        return null; // If item._id is not present, return null
      }
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
