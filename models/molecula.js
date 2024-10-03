import client from "../db/client"

class Molecula {
	constructor({
		id,
		nome,
		formula,
		estrutura
	}) {
		this.id = id,
		this.nome = JSON.parse(nome)
		this.formula = formula
		this.estrutura = JSON.parse(estrutura)
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
		const data = await client.execute({sql:`SELECT m.id, m.nome, m.formula, m.estrutura
			FROM molecula AS m, json_each(m.nome)
			WHERE json_each.value LIKE ?;`,
			args: [`%${term}%`]
		})
		const ids = []
		return data.rows.map(d => {
			if (ids.includes(d.id))
				return null
			ids.push(d.id)
			return new Molecula(d)
		} ).filter(d => d!=null)
	}
}

export default Molecula