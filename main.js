import './style.css'
import icons from './features/icons.js'
import Atom from './models/atom.js'
import Molecula from './models/molecula.js'
import winMolecula from './windows/winMolecula.js'

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

	const str_params = window.location.href.split("?")[1]
	const params = {}
	str_params.split("&").forEach(s => {
		const [k,v] = s.split("=")
		params[k] = unescape(decodeURIComponent(v))
	})

	if (params.molecula) {
		Molecula
		.SearchManyByTerm(params.molecula)
		.then((data) => {
			const w = new winMolecula(data[0])
			w.Render()
		})
	}
}).call(this)

