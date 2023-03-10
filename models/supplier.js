const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true, maxLength: 60 },
  cnpj: { type: Number, required: true },
  city: { type: String },
  state: { type: String, maxLength: 2, required: true }
});

SupplierSchema.virtual("url").get(function () {
  return `/inventory/supplier/${this._id}`;
});

SupplierSchema.virtual("location").get(function() {
  let loc = "";

  if(this.city != undefined){
    loc += this.city;
    loc += " - ";
  }
  loc += this.state;

  return loc;
})

module.exports = mongoose.model("Supplier", SupplierSchema);