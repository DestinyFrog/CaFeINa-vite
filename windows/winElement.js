import { Capitalize } from "../configuration.js"
import App from "../features/app.js"
import Atom from "../models/atom.js"
import Molecula from "../models/molecula.js"
import WinAtom from "./winAtom.js"
import WinLinusPauling from "./winLinusPauling.js"
import WinMolecula from "./winMolecula.js"

class WinElement extends App {
	static colls = []

	/**
	 * @param {Atom} atom
	 */
	constructor(atom) {
		super( Capitalize(atom.nome) )
		this.atom = atom
		this.i = WinElement.colls.push(this._indice)-1
		this.div_window.addEventListener('mouseup', () => this.OnDrop())
		this.div_window.addEventListener('touchend', () => this.OnDrop())
	}

	Render() {
		const { numero_atomico, simbolo, nome, massa_atomica, camadas } = this.atom

		const div_item = document.createElement('div')
		div_item.className = "item"
		div_item.innerHTML = `
			<p class="item-number">${numero_atomico}</p>
			<p class="item-symbol" style="color: ${this.atom.faseToColor};">${simbolo}</p>
			<p class="item-name">${Capitalize(nome)}</p>
			<p class="item-mass">${massa_atomica}</p>`

		const div_element = document.createElement('div')
		div_element.className = "element-container"
		div_element.style.backgroundColor = this.atom.categoryToColor
		div_element.appendChild(div_item)
		div_element.innerHTML += `<p class="item-shells">${camadas.join('</br>')}</p>`

		const button_open_diagram = document.createElement('button')
		button_open_diagram.textContent = "Diagrama"
		button_open_diagram.addEventListener('click', _ => this.OpenWinLinusPauling() )

		const button_visualize = document.createElement('button')
		button_visualize.textContent = "Visualizar"
		button_visualize.addEventListener('click', _ => this.OpenVisualization() )

		// super.AddToFooter(button_open_diagram)
		super.AddToFooter(button_visualize)
		super.AddToContainer(div_element)
	}

	Destroy() {
		delete WinElement.colls[this.i]
	}

	OpenWinLinusPauling() {
		const w = new WinLinusPauling(this.atom)
		w.Render()
	}

	OpenVisualization() {
		const w = new WinAtom(this.atom)
		w.position = this.position
		w.Render()
	}

	OnDrop() {
		const my_position = this.position
		const my_size = this.size

		const l = WinElement.colls.map(idx => {
			if (idx == this._indice) return
			const obj = App.open_apps[idx]

			if (
				my_position.x + my_size.width > obj.position.x &&
				my_position.x < obj.position.x + obj.size.width &&
				my_position.y + my_size.height > obj.position.y &&
				my_position.y < obj.position.y + obj.size.height
			) {
				return obj
			}
		}).filter(d => d!=undefined)

		if (l.length > 0) {
			const members = l.map(d => d.atom.simbolo)
			members.push(this.atom.simbolo)
			Molecula.SearchByMembers(members)
			.then(data => {
				if (data != undefined) {
					const w = new WinMolecula(data)
					w.position = this.position
					w.Render()
	
					l.forEach(d => d.Close())
					this.Close()
				}
			})
		}
	}
}

export default WinElement