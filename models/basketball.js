/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const basketballSchema = new Schema({
    PTA2 : { type  : Number, required : false },
    PTM2: { type  : Number, required : false },
    PTA3 : { type  : Number, required : false },
    PTM3 : { type : Number, required : false },
    AST : { type  : Number, required : false },
    BLK : { type  : Number, required : false },
    DRB : { type  : Number, required : false },
    FTA : { type  : Number, required : false },
    FTM : { type  : Number, required : false },
    ORB : { type  : Number, required : false },
    PF : { type  : Number, required : false },
    STL : { type  : Number, required : false },
    TO : { type  : Number, required : false },
    ASTPG : { type  : Number, required : false },
    STLPG : { type  : Number, required : false },
    PTP2 : { type  : Number, required : false },
    PTP3 : { type  : Number, required : false },
    AST_TO_RATIO : { type  : Number, required : false },
    BLKPG : { type  : Number, required : false },
    FGP : { type  : Number, required : false },
    FGA : { type  : Number, required : false },
    FGM : { type  : Number, required : false },
    FTP : { type  : Number, required : false },
    GP : { type  : Number, required : false },
    MINPG : { type  : Number, required : false },
    OPP : { type  : Number, required : false },
    OPPG : { type  : Number, required : false },
    PFPG : { type  : Number, required : false },
    PPG : { type  : Number, required : false },
    RPG : { type  : Number, required : false },
    TOPG : { type  : Number, required : false },
    MIN : { type  : Number, required : false },
    PTS : { type  : Number, required : false },
    TRB : { type  : Number, required : false },
    FF : { type  : Number, required : false },
    TECHF : { type  : Number, required : false },
    DQ : { type  : Number, required : false },
    GS : { type  : Number, required : false },
    TF : { type  : Number, required : false },
    W : { type  : Number, required : false },
    L : { type  : Number, required : false },
    T : { type  : Number, required : false }
});

module.exports = mongoose.model('Basketball', basketballSchema);

module.exports.createBasketballSchema = function(newBasketballSchema, callback){
    newBasketballSchema.save(callback);
}
