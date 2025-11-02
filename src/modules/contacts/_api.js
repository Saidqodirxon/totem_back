const express = require("express");
const postContact = require("./post");
const getContacts = require("./get");

const router = express.Router();

router.post("/contacts", postContact);
router.get("/contacts", getContacts);

module.exports = router;
