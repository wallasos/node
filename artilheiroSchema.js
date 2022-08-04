const mongoose = require('mongoose');

const artilheiroSchema = mongoose.Schema({
    nome: String,
    posicao: String,
    gols: Number,
    time: String
});

module.exports = artilheiroSchema;