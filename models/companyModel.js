import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String },
  companyId: { type: String },
  email: { type: String },
  sgst: { type: String, default: "10" },
  cgst: { type: String, default: "10" },
  igst: { type: String, default: "10" },
  address: String,
  gstin: String,
  iffc: String,
  bankName: String,
  branchName: String,
  accountNo: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminModel",
  },
});

const companyModel = mongoose.model("Company", companySchema);
export default companyModel;
