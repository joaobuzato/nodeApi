class ValorNaoSuportado extends Error{
    constructor(contentType){
        super(`o tipo de conteudo '${contentType}' não é suportado`);
        this.name = 'ValorNaoSuportado';
        this.idErro = 3 ;
    }
};

module.exports = ValorNaoSuportado;