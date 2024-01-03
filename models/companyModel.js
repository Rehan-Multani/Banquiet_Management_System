import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  sgst: { type: String },
  cgst: String,
  igst: String,
  address: String,
  gstin: String,
});

const companyModel = mongoose.model("Company", companySchema);
export default companyModel;
