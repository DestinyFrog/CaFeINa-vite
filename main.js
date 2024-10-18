import './style.css'
import icons from './features/icons.js'
import Atom from './models/atom.js'

( async () => {
	await Atom.loadAll()

	// Molecula.GetOneByName('água')

	const grid_app = document.getElementById('app')

	icons.forEach(({action, title, icon}) => {
		const but = document.createElement('button')
		but.className = 'app-icon'
		but.addEventListener('click', action)
		grid_app.appendChild(but)
		
		const img = document.createElement('img')
		img.src = icon
		but.appendChild(img)

		const t = document.createElement('p')
		t.textContent = title
		but.appendChild(t)
	})

} ).call(this)

