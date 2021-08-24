var mongoose        = require("mongoose");
const { Schema }    = mongoose;

var userSchema = new Schema({
    username: {
        type: String, 
        unique: true,
        required: true},
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isStreamer: {
        type: Boolean,
        default: false,
    },
    shinies: [
        {
        type: Schema.Types.ObjectId,
        ref: "Shinies"
        }
    ]
})


var User = mongoose.model("User", userSchema);
module.exports = User;