import companyModel from "../models/companyModel.js";

const updateCompany = async (req, res) => {
  const { sgst, email, cgst, igst, address, name, gstin } = req.body;
  const company = await companyModel.findOneAndUpdate(
    {},
    { name, gstin, address, cgst, sgst, igst, email },
    { new: true }
  );
  res.status(200).json({ company });
};
const getCompany = async (req, res) => {
  const company = await companyModel.findOne();
  res.status(200).json({ company });
};

export { updateCompany, getCompany };
