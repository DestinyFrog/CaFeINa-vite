import { Capitalize } from "../configuration.js"
import App from "../features/app.js"
import Atom from "../models/atom.js"
import WinElement from "./winElement"

import './winPeriodicTable.css'

const raio_atomico_cesio = 298
const eletronegatividade_fluor = 3.98

class WinPeriodicTable extends App {
	constructor(type_cell = "simplificada") {
		super("Tabela Periódica")
	
		this.type_cell = type_cell
		this.table = document.createElement('div')
		this.table.id = 'tabela-periodica'
		this.AddToContainer(this.table)

		this.categorias = []
	}

	/**
	 * @param {string} v
	 */
	set type(v) {
		this.type_cell = v
		this.drawTable()
	}

	markClassification() {
		if (this.categorias.length == 0) {
			for ( let c of this.table.children ) {
				c.style.opacity = 1
			}
			return
		}

		for ( let c of this.table.children ) {
			if ( this.categorias.find(n => n == c.getAttribute('categoria') ) != undefined ) {
				c.style.opacity = 1
			} else {
				c.style.opacity = .1
			}
		}
	}

	/**
	 * @param {import("../models/atom.js").Atom} atom 
	 * @returns {HTMLDivElement}
	 */
	drawCell(atom) {
		const cell = document.createElement('div')
		cell.className = 'tabela-periodica-cell'

		cell.style.gridRowStart = `${atom.pos.y}`
		cell.style.gridColumnStart = `${atom.pos.x}`

		const a = document.createAttribute("categoria")
		a.value = atom.categoria
		cell.setAttributeNode(a)

		/*
		cell.addEventListener('mouseover', () => {
			if (this.open == false)
				return
			this.categorias.push(atom.categoria)
			this.markClassification()
		})

		cell.addEventListener('mouseleave', () => {
			if (this.open == false)
				return
			this.categorias = this.categorias.filter(n => n != atom.categoria)
			this.markClassification()
		})
			*/
		

		cell.addEventListener('click', () => {
			const w = new WinElement(atom)
			w.Render()
		})

		switch(this.type_cell) {
			case 'completa':
				const txt_symbol = document.createElement('p')
				txt_symbol.textContent = atom.simbolo
				txt_symbol.style.color = ModelAtom.FaseToColor(atom)
				cell.appendChild(txt_symbol)

				const txt_name = document.createElement('p')
				txt_name.textContent = atom.nome
				cell.appendChild(txt_name)

				cell.style.backgroundColor = ModelAtom.CategoryToColor(atom)
				break

			case 'simplificada':
				cell.textContent = atom.simbolo
				cell.style.width = '30px'
				cell.style.backgroundColor = atom.categoryToColor
				cell.style.color = atom.faseToColor
				break

			case 'raio_atomico':
				cell.style.backgroundColor = 'transparent'
				cell.style.width = '30px'
				cell.style.padding = '2px'
				if (atom.raio_atomico) {
					const c = document.createElement('div')
					c.className = "atomic-radius"
					c.style.width = `${atom.raio_atomico*100/raio_atomico_cesio}%`
					c.style.backgroundColor = `rgb(0, ${atom.raio_atomico*255/raio_atomico_cesio}, ${atom.raio_atomico*100/raio_atomico_cesio})`
					cell.appendChild(c)
				} break

			case 'eletronegatividade':
				cell.innerHTML = (atom.eletronegatividade||'').toString()
				cell.style.width = '34px'
				cell.style.fontSize = '12px'
				cell.style.backgroundColor = `rgb(0, ${(atom.eletronegatividade||0)*150/eletronegatividade_fluor+50}, ${atom.eletronegatividade*100/eletronegatividade_fluor+50})`
				break
		}

		return cell
	}

	clearTable() {
		this.table.innerHTML = ""
	}

	drawTable() {
		this.clearTable()

		for (const atom of Atom.data) {
			const cell = this.drawCell(atom)
			this.table.appendChild(cell)
		}
	}

	Render() {
		this.drawTable()

		this.open = false

		const list = document.createElement('ul');
		list.className = 'classification-list'
		this.AddToContainer(list)
		list.style.display = this.open ? 'flex' : 'none'

		const button = document.createElement('button')
		button.innerText = 'Classificação'
		button.style.margin = '10px'
		button.addEventListener('click', () => {
			this.open = !this.open
			list.style.display = this.open ? 'flex' : 'none'
		})
		this.AddToFooter(button)

		const l = ['hidrogênio', 'metal alcalino', 'metal alcalino terroso', 'metal de transição', 'lantanídeo', 'actinídeo', 'outros metais', 'metaloide', 'ametal', 'gás nobre', 'desconhecido']
		l.forEach(d => {
			const li = document.createElement('li')

			const mark = document.createElement('input')
			mark.type = 'checkbox'
			mark.name = 'classification'
			li.appendChild(mark)

			const p = document.createElement('p')
			p.textContent = Capitalize(d)
			li.appendChild(p)

			mark.addEventListener('click', () => {
				if (mark.checked)
					this.categorias.push(d)
				else
					this.categorias = this.categorias.filter(n => n != d)
				
				this.markClassification()
			})

			list.appendChild(li)
		})


		/*
		const but_completa = document.createElement('button')
		but_completa.textContent = "Completa"
		but_completa.addEventListener('click', () => {
			this.type = 'completa'
		})
		this.AddToFooter(but_completa)
		*/

		/*
		const but_simplificada = document.createElement('button')
		but_simplificada.textContent = "Simplificada"
		but_simplificada.addEventListener('click', () => {
			this.type = 'simplificada'
		})
		this.AddToFooter(but_simplificada)

		const but_radius = document.createElement('button')
		but_radius.textContent = "Raio Atômico"
		but_radius.addEventListener('click', () => {
			this.type = 'raio_atomico'
		})
		this.AddToFooter(but_radius)

		const but_eletronegativity = document.createElement('button')
		but_eletronegativity.textContent = "Eletronegatividade"
		but_eletronegativity.addEventListener('click', () => {
			this.type = 'eletronegatividade'
		})
		this.AddToFooter(but_eletronegativity)
		*/
	}
}

export default WinPeriodicTable