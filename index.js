const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const artilheiroSchema = require('./artilheiroSchema');
const nome1 = [];
const gols1 = [];
const posicao1 = [];
const time1 = [];

const url = 'https://ge.globo.com/futebol/brasileirao-serie-a/';

// conectando no Atlas do MongoDB
function base(){
    mongoose.connect('mongodb+srv://wallasos:admin@cluster0.yewsd.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(result =>{
        //console.log('Conexão funcionando!')
    })
    .catch(error =>{
        console.log('Aconteceu algo errado' + error)
    })
};
base()

// extraindo dados do URL
axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const tabelaCompleta = $('div.ranking-item-wrapper');
    console.log('Adicionando os itens raspados da URL ao Atlas MongoDB.')

    tabelaCompleta.each(function () {
        const nome1 = $(this).find('.jogador-nome').text();
        const posicao1 = $(this).find('.jogador-posicao').text();
        const gols1 = $(this).find('.jogador-gols').text();
        const time1 = $(this).find('.jogador-escudo > img').attr('alt');

        // criando a collection no Atlas
        const tbJogador = mongoose.model('artilheiro', artilheiroSchema);

        // exportando os dados para a collection do Atlas
        const resultado = new tbJogador({
            nome: nome1,
            posicao: posicao1,
            gols: gols1,
            time: time1
        });

        // salvando os dados no Atlas do MongoDB
        resultado.save(function (error, resultado) {
            if (error)
                return console.log(err);
        });
        
    });
    console.log('Itens salvos no Atlas!')

}).catch(console.error);

// desconectando do MongoDB

setTimeout(()=>{
    mongoose.connection.close();
    console.log('Fechando as conexões com o Atlas...');
},10000);