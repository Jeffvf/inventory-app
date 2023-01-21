const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const SupplierSchema = new Schema({
  nome: { type: String, required: true, maxLength: 60 },
  cnpj: { type: Number, required: true },
  cidade: { type: String },
  estado: { type: String, maxLength: 2, required: true }
});

SupplierSchema.virtual("url").get(function () {
  return `/inventory/supplier/${this._id}`;
});

module.exports = mongoose.model("Supplier", SupplierSchema);