var mongoose        = require("mongoose");
const { Schema }    = mongoose;

var pokemonSchema = new Schema({
    data:{
        type: Array,
            id:{
                type: Number,
            },
            dex:{
                type: Number,
            },
            name:{
                type: String,
            },
            cucle:{
                type: Number,
            },
            type1:{
                type: String,
            },
            type2:{
                type: String,
            },
            mega:{
                type: Boolean,
            },
            galarian:{
                type: Boolean,
            },
            galarian_type1:{
                type: String,
                default: null,
            },
            galarian_type2:{
                type: String,
                default: null,
            },
            kanto:{
                type: Boolean,
            },
            johto:{
                type: Boolean,
            },
            hoenn:{
                type: Boolean,
            },
            hoennoras:{
                type: Boolean,
            },
            sinnoh:{
                type: Boolean,
            },
            sinnohplat:{
                type: Boolean,
            },
            unova:{
                type: Boolean,
            },
            unovab2w2:{
                type: Boolean,
            },
            kalos:{
                type: Boolean,
            },
            alola:{
                type: Boolean,
            },
            alolausum:{
                type: Boolean,
            },
            galar:{
                type: Boolean,
            },
            galardlc:{
                type: Boolean,
            },
    }
    
});


var pokemon = mongoose.model("pokemon", pokemonSchema);
module.exports = pokemon;