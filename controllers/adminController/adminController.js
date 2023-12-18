import userModel from "../../models/userModel.js";

const creationrole = async (req, res) => {
  try {
    const updatecreationID = req.params.id;

    const ifupdated = await userModel.findByIdAndUpdate(updatecreationID, {
      role: req.body.role,
    });
    console.log("ifupdated", ifupdated);
    if(ifupdated){
        res.status(200).send({
            success: true,
            message: `${req.body.role} is updated successfully..`,
          });
    }else{
        res.status(401).send({
            success: false,
            message: `you are not authorized`,
          });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
};


const getalldata = async (req, res) => {
  try {
    const alldata = await userModel.find({})

  const data =  alldata.filter((item)=>{
        return item.role !== "superadmin"
    })
    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "internal server Error" + error });
  }
}

export { creationrole, getalldata };
