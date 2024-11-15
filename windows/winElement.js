import { Capitalize } from "../configuration.js"
import App from "../features/app.js"
import Atom from "../models/atom.js"
import WinAtom from "./winAtom.js"
import WinLinusPauling from "./winLinusPauling.js"
import "./winElement.css"
import winMolecula from "./winMolecula.js"

class WinElement extends App {

	/**
	 * @param {Atom} atom
	 */
	constructor(atom) {
		super( Capitalize(atom.nome), "element" )
		this.atom = atom
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

	OpenWinLinusPauling() {
		const w = new WinLinusPauling(this.atom)
		w.Render()
	}

	OpenVisualization() {
		const w = new WinAtom(this.atom)
		w.position = this.position
		w.Render()
	}

	CallMe(data) {
		const w = new winMolecula(data)
		w.position = this.position
		w.Render()
	}
}

export default WinElement