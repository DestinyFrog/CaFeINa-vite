import client from "../db/client"

class Molecula {
	constructor({
		id,
		nome,
		formula,
		estrutura
	}) {
		this.id = id,
		this.nomes = JSON.parse(nome)
		this.formula = formula
		this.estrutura = JSON.parse(estrutura)
	}

	get nome() {
		return this.nomes[0]
	}

	static async SearchOneByTerm(term) {
		const data = await client.execute({sql:`SELECT m.id, m.nome, m.formula, m.estrutura
			FROM molecula AS m, json_each(m.nome)
			WHERE json_each.value LIKE ?
			LIMIT 0;`,
			args: [term]
		})
		
		const m = new Molecula(data.rows[0])
		return m
	}

	static async SearchManyByTerm(term) {
		const data = await client.execute({sql:`SELECT m.id, m.nome, m.formula, m.estrutura, m.caracteristicas
			FROM molecula AS m, json_each(m.nome)
			WHERE json_each.value LIKE ?
			OR m.caracteristicas LIKE ?
			;`,
			args: [`%${term}%`, `%${term}%`]
		})
		
		const list = Array.from( new Set(data.rows) )
		return list.map(l => new Molecula(l))
	}
}

export default Molecula