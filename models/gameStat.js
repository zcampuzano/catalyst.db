/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


const gameStatSchema = new Schema({
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' },
    stat: {
        PTA2 : { type: Number, required : false },
        PTM2: { type  : Number, required : false },
        PTA3 : { type  : Number, required : false },
        PTM3 : { type  : Number, required : false },
        AST : { type  : Number, required : false },
        BLK : { type  : Number, required : false },
        DRB : { type  : Number, required : false },
        FTA : { type  : Number, required : false },
        FTM : { type  : Number, required : false },
        ORB : { type  : Number, required : false },
        PF : { type  : Number, required : false },
        STL : { type  : Number, required : false },
        TO : { type  : Number, required : false },
    },
});


module.exports = mongoose.model('GameStat', gameStatSchema);

module.exports.createGameStat = function(newGameStatSchema, callback) {
    newGameStatSchema.save(callback);
}