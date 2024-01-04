import companyModel from "../models/companyModel.js";

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
  const company = await companyModel.findOne({ adminId: req.admin.id });
  res.status(200).json({ company });
};

export { updateCompany, getCompany };
