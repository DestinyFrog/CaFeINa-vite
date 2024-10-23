
/**
 * @typedef Atom
 * @prop {string} nome
 * @prop {number|null} raio_atomico distância do á camadas mais externa de elétrons (nanômetro nm)
 * @prop {number|null} eletronegatividade tendência á atrair outros elétrons em uma ligação química
 * @prop {number|null} massa_atomica massa do átomo (unidade de massa atômica 'u')
 * @prop {string} categoria categorias que dividem elementos pelas suas propriedades físicas e químicas
 * @prop {number} numero_atomico número atômico
 * @prop {number} periodo
 * @prop {number} familia
 * @prop {string} simbolo
 * @prop {string} fase estado físico natural do elemento
 * @prop {number} xpos posição no eixo X da Tabela Periódica
 * @prop {number} ypos posição no eixo Y da Tabela Periódica
 * @prop {number[]} camadas elétrons por camada
 * @prop {string} configuracao_eletronica Configuração Eletrônica no formato escrito
 */

// import client from "../db/client"
import data from "./elementos.json"

class Atom {
	/**
	 * @type {Atom[]}
	*/
	static data = []

	constructor({
		numero_atomico,
		nome,
		simbolo,
		categoria,
		xpos, ypos,
		raio_atomico,
		massa_atomica,
		eletronegatividade,
		periodo, familia,
		fase,
		camadas,
		configuracao_eletronica
	}) {
		this.numero_atomico = numero_atomico
		this.nome = nome
		this.simbolo = simbolo
		this.categoria = categoria
		this.pos = {
			x: xpos,
			y: ypos
		}
		this.raio_atomico = raio_atomico
		this.massa_atomica = massa_atomica
		this.eletronegatividade = eletronegatividade
		this.periodo = periodo
		this.familia = familia
		this._fase = fase
		this.camadas = JSON.parse(camadas)
		this.configuracao_eletronica = configuracao_eletronica
	}

	get fase() {
		switch(this._fase) {
			case 'G': return 'gasoso'
			case 'L': return 'líquido'
			case 'S': return 'sólido'
		}
	}

	/** return all categories available
	 * @return
	 */
	static get allCategory() {
		return new Set( Atom.data.map(({categoria}) => categoria) )
	}

	/** convert atom category to a color
	 * @returns {string}
	 */
	get categoryToColor() {
		switch(this.categoria) {
			case 'gás nobre':				return '#9400d3'
			case 'metal alcalino':			return '#e5b80b'
			case 'metal alcalino terroso':	return '#FF6600'
			case 'metaloide':				return '#8db600'
			case 'ametal':					return '#008000'
			case 'hidrogênio':				return '#8c0250'
			case 'metal de transição':		return '#970700'
			case 'outros metais':			return '#ff007f'
			case 'lantanídeo':				return '#054f77'
			case 'actinídeo':				return '#4169e1'
			case 'halogênio':				return '#304EE6'
			case 'desconhecido':			return '#333333'
			default:						return '#000000'
		}
	}

	static categoryToColor(categoria) {
		switch(categoria) {
			case 'gás nobre':				return '#9400d3'
			case 'metal alcalino':			return '#e5b80b'
			case 'metal alcalino terroso':	return '#FF6600'
			case 'metaloide':				return '#8db600'
			case 'ametal':					return '#008000'
			case 'hidrogênio':				return '#8c0250'
			case 'metal de transição':		return '#970700'
			case 'outros metais':			return '#ff007f'
			case 'lantanídeo':				return '#054f77'
			case 'actinídeo':				return '#4169e1'
			case 'halogênio':				return '#304EE6'
			case 'desconhecido':			return '#333333'
			default:						return '#000000'
		}
	}	

	/** convert atom phase to a color
	 * @returns {string}
	 */
	get faseToColor() {
		switch(this.fase) {
			case 'sólido':			return '#ffffff'
			case 'líquido':			return '#ff2222'
			case 'gasoso':			return '#aaaaff'
			default:				return '#000000'
		}
	}

	toJSON() {
		return {
			numero_atomico : this.numero_atomico,
			nome : this.nome,
			simbolo : this.simbolo,
			categoria : this.categoria,
			xpos: this.pos.x,
			ypos: this.pos.y,
			raio_atomico : this. raio_atomico,
			massa_atomica : this. massa_atomica,
			eletronegatividade : this. eletronegatividade,
			periodo : this.periodo,
			familia : this.familia,
			fase : this._fase,
			camadas : JSON.stringify(this.camadas),
			configuracao_eletronica : this.configuracao_eletronica
		}
	}

	static async loadAll() {
		// const {rows} = await client.execute("SELECT * FROM elemento")
		
		const rows = data
		
		rows.forEach(d => {
			const atom = new Atom(d)
			Atom.data.push(atom)
		})
	}

	/** search atoms using a term [string]
	 * only by symbol
	 * @param {string} term
	 * @returns {Atom|undefined}
	 */
	static SearchByTerm(term) {
		return Atom.data.find(({simbolo}) => simbolo == term)
	}

	/** search atoms using a term [string]
	 * only by symbol
	 * @param {string} term
	 * @returns {Atom[]}
	 */
	static SearchManyByTerm(term) {
		return Atom.data.filter(({simbolo, nome}) => simbolo.includes(term) || nome.includes(term) )
	}
}

export default Atom