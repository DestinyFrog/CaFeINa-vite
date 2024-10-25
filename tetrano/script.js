import Molecula from '../models/molecula.js'
import './style.css'

const app = document.getElementById('app')

const nav = document.createElement('nav')
nav.className = 'inspector'
app.appendChild(nav)

const txtarea = document.createElement('textarea')
txtarea.cols = 20
txtarea.rows = 20
nav.appendChild(txtarea)

txtarea.addEventListener('keydown', function(e) {
	if (e.key == 'Tab') {
	  e.preventDefault();
	  var start = this.selectionStart;
	  var end = this.selectionEnd;
  
	  // set textarea value to: text before caret + tab + text after caret
	  this.value = this.value.substring(0, start) +
		"\t" + this.value.substring(end);
  
	  // put caret at right position again
	  this.selectionStart =
		this.selectionEnd = start + 1;
	}
  })

const WIDTH = 300
const HEIGHT = 300
const CENTER = { x: WIDTH/2, y: HEIGHT/2 }

const canvas = document.createElement('canvas')
canvas.className = 'compounder-canvas'
app.appendChild(canvas)
canvas.width = WIDTH
canvas.height = HEIGHT

// 0, 120, 240
// 180, 60, 300

const geo = {
	"trigonal plana": [ 0, 120, 240 ],
	"tetraédrica": [ 0, 90, 180, 270 ],
	"angular V": [20, 160],
	"linear": [ 0, 180 ]
}

const distancia = 40
const ligacao_distancia = 10
const espaco_ligacao = 20

class Compounder {
	constructor() {
		this.ctx = canvas.getContext('2d')
	}

	Update(mol) {
		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(0, 0, WIDTH, HEIGHT)

		const estrutura = JSON.parse(mol)
		this.Next(estrutura)
	}

	Next(all, idx=0, idx_pai=null, order=0, camada=0) {
		const eu = all[idx]
		const pai = all[idx_pai] || null

		eu.lido = true

		if (pai)
			eu.angle = (pai?.angle||0) + geo[pai.geometria || "linear"][order]
		else
			eu.angle = 0

		if (eu?.inverso == true)
			eu.angle = eu.angle + 180

		eu.pos = {
			x: (pai?.pos.x||0) + Math.cos(eu.angle / 180 * Math.PI) * distancia,
			y: (pai?.pos.y||0) + Math.sin(eu.angle / 180 * Math.PI) * distancia
		}

		this.drawLett(eu)

		if (eu.ligacoes)
			eu.ligacoes.forEach(({para, eletrons=1}, eidx) => {				
				if (all[para].lido != true) {
					const filho = this.Next(all, para, idx, eidx, camada+1)
					this.drawLig(filho, eu, eletrons)
				}
			})

		return eu
	}

	drawLett(a) {
		let {pos, simbolo, carga} = a

		// Configurar Context2D
		this.ctx.fillStyle = "#000"
		this.ctx.font = '18px Courier New monospace'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline =  'middle'

		const x = pos.x + CENTER.x
		const y = pos.y + CENTER.y
		this.ctx.fillText(simbolo, x, y)

		this.ctx.font = '12px Courier New monospace'
		carga = carga || 0
		this.ctx.fillText(carga!=0?(carga==1?'+':(carga==-1?'-':(carga<0?'-':'+') + carga )):'', x+11, y-11)
	
	}

	drawLig(a, b, eletrons=1) {	
		this.ctx.strokeStyle = "black"
		this.ctx.lineWidth = 1

		for (let i = 0; i < eletrons; i++) {
			const ax = a.pos.x + Math.cos( ((a.angle + (i*espaco_ligacao)) + 180) / 180 * Math.PI) * ligacao_distancia
			const ay = a.pos.y + Math.sin( ((a.angle + (i*espaco_ligacao)) + 180) / 180 * Math.PI) * ligacao_distancia
			const bx = b.pos.x + Math.cos( (a.angle - (i*espaco_ligacao)) / 180 * Math.PI) * ligacao_distancia
			const by = b.pos.y + Math.sin( (a.angle - (i*espaco_ligacao)) / 180 * Math.PI) * ligacao_distancia

			this.ctx.beginPath()
			this.ctx.moveTo(ax + CENTER.x, ay + CENTER.x)
			this.ctx.lineTo(bx + CENTER.y, by + CENTER.y)
			this.ctx.stroke()
		}
	}
}

const comp = new Compounder()

txtarea.addEventListener('input', () => {
	comp.Update(txtarea.value)
})
