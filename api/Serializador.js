const ValorNaoSuportado = require("./erros/ValorNaoSuportado")
const jsontoxml = require('jsontoxml')
class Serializador {
    serializar(dados){
        dados = this.filtrar(dados)
        if(this.contentType === 'application/json'){
            return this.json(dados)
        } 
        if(this.contentType === 'application/xml'){
            return this.xml(dados)
        }
        throw new ValorNaoSuportado(this.contentType)
        
    }

    json (dados){
        return JSON.stringify(dados)
    }

    xml (dados) {
        let tag = this.tagSingular
        if(Array.isArray(dados)){

            tag = this.tagPlural
            dados = dados.map((item) => { 
                return { 
                    [this.tagSingular]: item
                }
            })
        }
        return jsontoxml({ [tag]: dados })
    }

    filtrarObjeto(dados) {
        let novoObjeto = {}
        this.camposPublicos.forEach((campo) =>{
            if (dados.hasOwnProperty(campo)){
                novoObjeto[campo] = dados[campo]
            } 
        })

        return novoObjeto
    }

    filtrar (dados) {
        if (Array.isArray(dados)){
            dados = dados.map(item => { 
                return this.filtrarObjeto(item)})
        } else {
            dados = this. filtrarObjeto(dados)
        }

        return dados
    }
}


class SerializadorFornecedor extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.camposPublicos = ["id", 'empresa', 'categoria'].concat(camposExtras || [])
        this.contentType = contentType
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.camposPublicos = ["id", "mensagem"]. concat(camposExtras || [])
        this.contentType = contentType
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    formatosAceitos: ['application/json', 'application/xml'],
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro
}