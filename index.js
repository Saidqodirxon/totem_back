const express = require("express");
const cors = require("cors");
const db = require("./src/db");
const config = require("./src/shared/config");
const handleError = require("./src/shared/errors/handle");
//
const UserRoute = require("./src/modules/users/_api");
const ServicesRoute = require("./src/modules/products/_api");
const CategoriesRoute = require("./src/modules/categories/_api");
const ActionsRoute = require("./src/modules/actions/_api");
const NewsRoute = require("./src/modules/news/_api");
const FaqsRoute = require("./src/modules/faqs/_api");
const SubcategoriesRoute = require("./src/modules/subcategory/_api");
const ExchangeRateRoute = require("./src/modules/exchange-rate/_api");

const ContactsRoute = require("./src/modules/contacts/_api");
const Uploader = require("./src/modules/upload");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use("/public", express.static("public"));

app.use(UserRoute);
app.use(NewsRoute);
app.use(FaqsRoute);
app.use(ServicesRoute);
app.use(SubcategoriesRoute);
app.use(ContactsRoute);
app.use(CategoriesRoute);
app.use(ActionsRoute);
app.use("/usd", ExchangeRateRoute);
app.use(Uploader);

app.use(handleError);

db();
app.listen(config.port, () => {
  console.log(`Server ${config.port}-portda ishlayapti.`);
});
