const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const request = require('request');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (requisicao, resposta) =>  {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    //resposta.body = request('https://http.cat/'+ resposta.status)
    const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'))
        resposta.send(
            serializador.serializar(resultados)
        )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'))
        resposta.send(
            serializador.serializar(fornecedor)
        )
    }
    catch(erro) {
        proximo(erro)
    }
    
})

roteador.get('/:idFornecedor', async (requisicao,resposta, proximo) => {
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        resposta.status(200)
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'), ["email"])
        resposta.send(
            serializador.serializar(fornecedor)
        )
    }
    catch(erro) {
        proximo(erro)
    }

})

roteador.put('/:idFornecedor', async (requisicao, resposta, proximo) =>{
    try{
        const id = requisicao.params.idFornecedor
        const dadosRecebidos = requisicao.body
        const dados = Object.assign({}, dadosRecebidos, {id:id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    }
    catch(erro) {
       proximo(erro)
    }
})

roteador.delete('/:idFornecedor', async (requisicao, resposta, proximo) => {
    try{
        const id = requisicao.params.idFornecedor
        const fornecedor = new Fornecedor({id:id})
        await fornecedor.carregar()
        await fornecedor.remover()
        resposta.status(204)
        //request('https://http.cat/'+ resposta.status)
        resposta.end()
    }
    catch(erro) {
        proximo(erro)
    }
})


module.exports = roteador