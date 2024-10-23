import { GenerateRandomString } from '../configuration'
import './app.css'


class App {
	static open_apps = []

	static Clear() {
		for (let i = App.open_apps.length-1; i >= 0; i--)
			App.open_apps[i]?.Close()
	}

	Render() {}
	Destroy() {}

	DragAndDropSystem() {
		this.drag_position = {x:0, y:0} 
		this.before_drag_position = {x:0, y:0}

		this.div_header.addEventListener('mousedown', ev => {
			this.before_drag_position.x = ev.clientX
			this.before_drag_position.y = ev.clientY

			const mouseMove = (ev) => {
				if (ev.clientX > 0 && ev.clientX < document.body.clientWidth) {
					this.drag_position.x = this.before_drag_position.x - ev.clientX
					this.before_drag_position.x = ev.clientX
					this.div_window.style.left = `${this.div_window.offsetLeft - this.drag_position.x}px`	
				}
				
				if (ev.clientY > 0 && ev.clientY < document.body.clientHeight) {
					this.drag_position.y = this.before_drag_position.y - ev.clientY
					this.before_drag_position.y = ev.clientY
					this.div_window.style.top = `${this.div_window.offsetTop - this.drag_position.y}px`
				}
			}

			document.addEventListener('mousemove', mouseMove)
			document.addEventListener('mouseup', _ => {
				document.removeEventListener('mousemove', mouseMove)
			})
		})

		this.div_header.addEventListener('touchstart', ev => {
			this.before_drag_position.x = ev.touches[0].clientX
			this.before_drag_position.y = ev.touches[0].clientY

			const mouseMove = (ev) => {
				this.drag_position.x = this.before_drag_position.x - ev.touches[0].clientX
				this.drag_position.y = this.before_drag_position.y - ev.touches[0].clientY
	
				this.before_drag_position.x = ev.touches.item(0)?.clientX
				this.before_drag_position.y = ev.touches[0].clientY

				this.div_window.style.top = `${this.div_window.offsetTop - this.drag_position.y}px`
				this.div_window.style.left = `${this.div_window.offsetLeft - this.drag_position.x}px`
			}

			document.addEventListener('touchmove', mouseMove)
			document.addEventListener('touchend', _ =>
				document.removeEventListener('touchmove', mouseMove) )
		})
	}

	static allByType(typeForSearch) {
		return this.open_apps.filter( ({_type}) => _type == typeForSearch )
	}

	/**
	 * @param {string} name
	 */
	constructor(name, type, unique=false) {
		const app = document.querySelector('#app')

		this._type = type
		this.id = GenerateRandomString(8)
		this._unique = unique

		this.div_window = document.createElement('div')
		this.div_window.className = "app"
		this.div_window.style.top  = `${10}px`
		this.div_window.style.left = `${10}px`
		app.appendChild(this.div_window)

		this.div_header = document.createElement('div')
		this.div_header.className = "app-header"
		app.appendChild(this.div_header)
		this.div_window.appendChild(this.div_header)

		this.DragAndDropSystem()

		this.div_container = document.createElement('div')
		this.div_container.className = "app-container"
		app.appendChild(this.div_container)
		this.div_window.appendChild(this.div_container)

		this.div_footer = document.createElement('div')
		this.div_footer.className = "app-footer"
		app.appendChild(this.div_footer)
		this.div_window.appendChild(this.div_footer)

		const window_label = document.createElement('p')
		window_label.className = "app-label"
		window_label.textContent = name
		this.div_header.appendChild(window_label)

		const button_close_window = document.createElement('div')
		button_close_window.className = "app-closer"
		button_close_window.addEventListener('click', _ => {
			this.Close()
		})
		this.div_header.appendChild(button_close_window)

		this._indice = App.open_apps.push(this)-1
	}

	Close() {
		this.Destroy()
		this.div_window.remove()
		delete App.open_apps[this._indice]
	}

	set position ({x, y}) {
		this.div_window.style.top = `${y}px`
		this.div_window.style.left = `${x}px`
	}

	get position () {
		return {
			x: parseFloat( this.div_window.style.left.replace('.px','') ),
			y: parseFloat( this.div_window.style.top.replace('.px','') )
		}
	}

	get size() {
		return {
			width: this.div_window.clientWidth,
			height: this.div_window.clientHeight
		}
	}

	Centralize() {
		this.div_container.classList.add('centralize')
	}

	AddToContainer(el) {
		this.div_container.appendChild(el)
	}

	AddToFooter(el) {
		this.div_footer.appendChild(el)
	}

	AddToHeader(el) {
		this.div_header.appendChild(el)
	}
}

export default App