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
		this._estrutura = JSON.parse(estrutura)
	}

	get nome() {
		return this.nomes[0]
	}

	get estrutura() {
		return this._estrutura.map(({simbolo,geometria,carga,angulo,ligacoes}) => {
			return {
				simbolo,
				geometria: geometria || 'linear',
				carga: carga || 0,
				angle: angulo || undefined,
				ligacoes: ligacoes?.map(({para, tipo, eletrons}) => {
					return {
						para,
						tipo: tipo || 'covalente',
						eletrons: eletrons || 1
					}
				}) || []
			}
		})
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

	static async SearchByMembers(members) {
		const condition = members.map(d => `formula LIKE '%${d}%'`).join(" AND ")
		const sql = `SELECT id, nome, formula, estrutura, caracteristicas FROM molecula WHERE ${condition} LIMIT 1;`
		const data = await client.execute(sql)
		const m = new Molecula(data.rows[0]) || null
		return m
	}
}

export default Molecula