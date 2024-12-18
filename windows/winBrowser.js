import './winBrowser.css'
import App from "../features/app.js"
import Atom from "../models/atom.js"
import WinElement from "./winElement.js"
import WinMolecula from "./winMolecula.js"
import Molecula from "../models/molecula.js"
import Dicionario from '../models/dicionario.js'

class winBrowser extends App {
	constructor(procura) {
		super("Navegador")
		this.procura = procura
	}

	Render() {
		const bar = document.createElement('div')
		bar.className = 'browser-bar'
		this.AddToContainer(bar)

		const search_input = document.createElement('input')
		search_input.type = 'text'
		search_input.value = this.procura||""
		search_input.addEventListener('input', () => {
			this.SearchFor(search_input.value)
		})
		bar.appendChild(search_input)

		this.def = document.createElement('div')
		this.def.className = 'browser-content'
		bar.appendChild(this.def)

		this.recomendation = document.createElement('ul')
		this.recomendation.className = 'browser-ul-recomendation'
		bar.appendChild(this.recomendation)

		this.atom_area = document.createElement('div')
		this.recomendation.appendChild(this.atom_area)

		const hr = document.createElement('hr')
		this.recomendation.appendChild(hr)

		this.molecule_area = document.createElement('div')
		this.recomendation.appendChild(this.molecule_area)

		if (this.procura)
			this.SearchFor(this.procura)
	}

	async SearchFor(term) {
		if (term == '')
			return

		this.atom_area.innerHTML = ''
		this.SearchAtoms(term)

		Dicionario.searchFor(term)
		.then(([data]) => {
			if (data) 
				this.def.textContent = data.descricao		
			else
				this.def.textContent = ''
		})
		.catch(err => {
			console.error(err)
		})

		let data2

		if (term == "orgânico")
			data2 = await Molecula.SearchOrganic()
		else if (term == "inorgânico")
			data2 = await Molecula.SearchInorganic()
		else
			data2 = await Molecula.SearchManyByTerm(term)

		this.molecule_area.innerHTML = ''
		data2.forEach(
			m => {
				const li = document.createElement('li')
				let formula = m.formula
					.replaceAll("<", "_")
					.replaceAll(">", "</sub>")
					.replaceAll("_", "<sub>")

				const nome_p = document.createElement('p')
				nome_p.textContent = m.nomes.popular[0]
				li.appendChild(nome_p)

				const formula_p = document.createElement('p')
				formula_p.style.textAlign = 'right'
				formula_p.innerHTML = formula
				li.appendChild(formula_p)

				li.addEventListener('click', () => {
					const w = new WinMolecula(m)
					w.Render()
				})
				
				this.molecule_area.appendChild(li)
			}
		)
	}

	SearchAtoms(term) {
		Atom.SearchManyByTerm(term)
		.sort(({ numero_atomico: n1 }, { numero_atomico: n2 }) => n1 > n2 ? 1 : -1)
		.forEach(m => {
			const li = document.createElement('li')

			const nome_p = document.createElement('p')
			nome_p.textContent = `${m.numero_atomico} - ${m.nome}`
			li.appendChild(nome_p)

			const simbolo_p = document.createElement('p')
			simbolo_p.textContent = m.simbolo
			li.appendChild(simbolo_p)

			li.addEventListener('click', () => {
				const w = new WinElement(m)
				w.Render()
			})

			this.atom_area.appendChild(li)
		})
	}
}

export default winBrowser