import './style.css'
import icons from './features/icons.js'
import Atom from './models/atom.js'

( async () => {
	await Atom.loadAll()

	const grid_app = document.createElement('footer')

	icons.forEach(({action, icon}) => {
		const but = document.createElement('button')
		but.className = 'app-icon'
		but.addEventListener('click', action)
		grid_app.appendChild(but)
		
		const img = document.createElement('img')
		img.src = icon
		but.appendChild(img)
	})

	document.getElementById('app').appendChild(grid_app)
} ).call(this)

