import client from "../db/client"

class Dicionario {
	constructor( {
		id,
		titulos,
		descricao
	}) {
		this.id = id
		this.titulos = JSON.parse(titulos)
		this.descricao = descricao
	}

	static removeCopy(arr) {
		return arr.reduce((prev, cur) => {
			if ( prev.find(({id}) => id == cur.id) ) {
				return prev
			} else {
				return [ ... prev, cur ]
			}
		}, [])
	}

	static async searchFor(term) {
		const data = await client.execute({sql:`SELECT m.id, m.titulos, m.descricao
			FROM dicionario AS m, json_each(m.titulos)
			WHERE json_each.value LIKE ?;`,
			args: [term]
		})
		
		const list = this.removeCopy(data.rows)
		return list.map(l => new Dicionario(l))
	}
}

export default Dicionario