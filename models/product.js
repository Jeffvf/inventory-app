const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 80 },
  description: { type: String, maxLength: 400},
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  supplier: [{ type: Schema.Types.ObjectId, ref: "Supplier", required: true }]
});

ProductSchema.virtual("url").get(function() {
  return `/inventory/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);