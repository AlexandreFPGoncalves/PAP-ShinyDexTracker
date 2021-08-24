var mongoose        = require("mongoose");
const { Schema }    = mongoose;

var shiniesSchema = new Schema({
    trainer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    trainer_name:{
        type: Schema.Types.String,
        ref: "User"
    },
    dex:{
        type: Number,
        default: null
    },
    pokemon_name: {
        type: String,
        minLength: 5,
        maxlength: 20,
        required: true,
    },
    pokemon_nickname: {
        type: String,
        minLength: 0,
        maxlength: 20,
        required: false,
    },
    encounters: {
        type: Number,
        required: false
    },
    method: {
        type: String,
        required: false
    },
    pokeball: {
        type: String,
        required: false
    },
    caught_game: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    caught_date: {
        type: Date,
        default: Date.now,
        required: false
    },
    shiny_charm: {
        type: Boolean,
        default: false,
        required: false
    },
    
})


var shiny = mongoose.model("shiny", shiniesSchema);
module.exports = shiny;