import './style.css'
import icons from './features/icons.js'
import Atom from './models/atom.js'
import WinPeriodicTable from './windows/winPeriodicTable.js'

( async () => {
	await Atom.loadAll()

	const grid_app = document.createElement('footer')

	icons.forEach(({action, title, icon, color}) => {
		const but = document.createElement('button')
		but.className = 'app-icon'
		but.addEventListener('click', action)
		grid_app.appendChild(but)
		
		const img = document.createElement('img')
		img.src = icon
		but.appendChild(img)

		const t = document.createElement('p')
		t.textContent = title
		// but.appendChild(t)
	})

	document.getElementById('app').appendChild(grid_app)

} ).call(this)

