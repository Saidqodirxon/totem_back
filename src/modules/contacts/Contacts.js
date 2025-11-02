const mongoose = require("mongoose");

const ContactsSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      // required: true,
    },
    products: {
      type: mongoose.SchemaTypes.Array,
      // required: true,
    },
    phone: {
      type: mongoose.SchemaTypes.String,
      // required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contacts = mongoose.model("Contacts", ContactsSchema);

module.exports = Contacts;
