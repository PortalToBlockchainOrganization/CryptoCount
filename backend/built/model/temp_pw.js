let mongoose = require("mongoose");
let temp_pw_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    temp_pw: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: { type: Date, expires: "24hr", default: Date.now },
});
module.exports = mongoose.model("temp_pw_schema", temp_pw_schema);
