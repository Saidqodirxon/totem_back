const mongoose = require("mongoose");

const ContactsSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
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
