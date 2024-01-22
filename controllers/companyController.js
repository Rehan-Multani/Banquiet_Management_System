import adminModel from "../models/adminModel/adminModel.js";
import companyModel from "../models/companyModel.js";
import userModel from "../models/userModel.js";

const updateCompany = async (req, res) => {
  const {
    sgst,
    email,
    cgst,
    igst,
    address,
    name,
    gstin,
    branchName,
    accountNo,
    bankName,
    iffc,
  } = req.body;
  const company = await companyModel.findOneAndUpdate(
    { adminId: req.user.id },
    {
      name,
      gstin,
      address,
      cgst,
      sgst,
      igst,
      email,
      accountNo,
      branchName,
      bankName,
      iffc,
    },
    { new: true }
  );
  res.status(200).json({ company });
};
const getCompany = async (req, res) => {
  let companyname;
  const data = await userModel.findById(req.user.id);
  if (data) {
    companyname = data.companyname;
  } else {
    const admin = await adminModel.findById(req.user.id);
    companyname = admin.companyname;
  }
  const company = await companyModel.findOne({ name: companyname });
  res.status(200).json({ company });
};

export { updateCompany, getCompany };
