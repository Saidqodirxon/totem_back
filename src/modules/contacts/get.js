const Contacts = require("./Contacts");

const getContacts = async (req, res) => {
  try {
    const contacts = await Contacts.find();
    res.status(200).json({
      message: "Contacts retrieved successfully.",
      data: contacts,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({
      error: "An error occurred while retrieving contacts.",
    });
  }
};

module.exports = getContacts;
