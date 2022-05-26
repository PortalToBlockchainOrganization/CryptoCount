const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    setIds: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});
// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
