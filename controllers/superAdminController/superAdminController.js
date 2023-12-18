import userModel from "../../models/userModel.js";

const creationrole = async (req, res) => {
  try {
    const updatecreationID = req.params.id;
    const ifupdated = await userModel.findByIdAndUpdate(updatecreationID, {
      role: req.body.role,
    });

    res.status(200).send({
      success: true,
      message: `${req.body.role} is updated successfully..`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};

export { creationrole };
