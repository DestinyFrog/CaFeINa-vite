import { Capitalize, DegreesToRadians } from "../configuration.js"
import App from "../features/app.js"
import Atom from "../models/atom.js"
import Molecula from "../models/molecula.js"

/**
 * Vector 2
 * @typedef {{x:number, y:number}} Vector2
*/

class WinMolecula extends App {
	/**
	 * @param {Molecula} data
	 */
	constructor(data, s='normal') {
		console.log(data.estrutura)
		super( Capitalize(data.nome) )
		this.data = data
		this._type = s
	}

	/**
	 * @param {('geo'|'normal'|'lewis')} value 
	 */
	set type(value) {
		this._type = value
		this.Update()
	}

	Update() {
		switch(this._type) {
			case 'normal':
				this.structure = new NormalStructure(this.canvas, this.data.estrutura)
				break

			case 'lewis':
				this.structure = new LewisStructure(this.canvas, this.data.estrutura)
				break

			case 'geo':
				this.structure = new GeoStructure(this.canvas, this.data.estrutura)
				break
		}

		this.structure.Draw()
	}

	Render() {
		this.canvas = document.createElement('canvas')
		this.canvas.className = 'in-screen'
		this.AddToContainer(this.canvas)

		const button_normal = document.createElement('button')
		button_normal.textContent = 'Normal'
		button_normal.addEventListener('click', () => this.type = 'normal')
		this.AddToFooter(button_normal)

		/*
		const button_lewis = document.createElement('button')
		button_lewis.textContent = 'Lewis'
		button_lewis.addEventListener('click', () => this.type = 'lewis')
		this.AddToFooter(button_lewis)

		const button_geo = document.createElement('button')
		button_geo.textContent = 'Geométrica'
		button_geo.addEventListener('click', () => this.type = 'geo')
		this.AddToFooter(button_geo)
		*/

		this.Update()
	}
}

class Structure {
	/**
	 * @param {HTMLCanvasElement} canvas 
	 */
	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false
		this.border = 20
		this.atoms = []
		this.ligations = []
	}

	/** Start Drawing Process */
	Draw() {
		this.SetSize()
		this.ctx.fillStyle = '#fff'
		this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT)
		this.atoms.forEach(atom => this.DrawAtom(atom) )
		this.ligations.forEach(ligation=> this.drawLig(ligation) )
	}

	/** Set Screen Size */
	SetSize() {
		this.big_x = 0
		this.big_y = 0
		this.small_x = 0
		this.small_y = 0

		for ( const {pos: {x, y}} of this.atoms ) {
			if ( x > this.big_x )	this.big_x = x
			if ( x < this.small_x )	this.small_x = x
			if ( y > this.big_y )	this.big_y = y
			if ( y < this.small_y )	this.small_y = y
		}

		this.WIDTH = (-this.small_x + this.big_x) + this.border*2
		this.HEIGHT = (-this.small_y + this.big_y) + this.border*2
		this.canvas.width = this.WIDTH
		this.canvas.height = this.HEIGHT
	}

	/** Draw Ligations Between Atoms
	 * @param { {from:Vector2, to:Vector2} } ligation
	 */
	DrawLigation(ligation) {}

	/** Draw Atoms
	 * @param { Atom } atom
	 */
	DrawAtom(atom) {}
}

const geometria = {
	"tetraédrica": 4,
	"piramidal": 3,
	"trigonal plana": 3,
	"linear": 2,
	"angular V": 2,
	"angular": 2
}

class NormalStructure extends Structure {
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {AtomicLigation} data
	 */
	constructor(canvas, data) {
		super(canvas)
		this.radius = 40
		this.ligation_radius = 14
		this.ligation_distance = DegreesToRadians(16)
		this.ThrowAtoms(data)
	}

	/** Recursively Define Position of the Elements in Screen
	 * @param {import("../models/molecule.js").AtomInLigation[]} atomList
	 * @param {number} index 
	 * @param {number} order
	 * @param {number|undefined} index_dad
	 */
	ThrowAtoms(all, idx=0, idx_pai=null, order=0, camada=0) {
		/*
		const atom = atomList[index]
		const dad = this.atoms[index_dad] || null

		let max_ligations = geometria[dad?.geometria] || 1
		let angle = (dad?.angle||0) + 360/max_ligations * order
		
		const angle_rad = DegreesToRadians(angle)
		const x = (dad?.pos.x||0) + (index_dad==undefined?0:Math.cos(angle_rad)) * this.radius
		const y = (dad?.pos.y||0) + Math.sin(angle_rad) * this.radius

		const me = { ... atom, pos: {x,y}, angle: atom.angle||0 }
		const my_index = this.atoms.push(me) -1

		if (dad) {
			if ( dad.ligacoes[order].tipo != 'iônica') {
				// const ligation_angle =  dad.ligacoes[order].eletrons!=1 ? this.ligation_distance : 0

				for (let i = 0; i < dad.ligacoes[order].eletrons; i++) {
					let j = 0
					switch(dad.ligacoes[order].eletrons) {
						case 3:
							j = i-1
							break
						case 2:
							j = i==0?-1:1
					}
					
					const ligation_angle = this.ligation_distance*j

					const from = {
						x: this.ligation_radius * Math.cos(angle_rad+Math.PI - ligation_angle) + x,
						y: this.ligation_radius * Math.sin(angle_rad+Math.PI - ligation_angle) + y
					}

					const to = {
						x: this.ligation_radius * Math.cos(angle_rad + ligation_angle) + dad.pos.x,
						y: this.ligation_radius * Math.sin(angle_rad + ligation_angle) + dad.pos.y
					}

					this.ligations.push({from,to})
				}
				
			}
		}

		atom.ligacoes.forEach(({para}, idx) =>
			this.ThrowAtoms(atomList, para, idx, my_index) )
		*/
		const distancia = 40
		const geo = {
			"trigonal plana": [ 0, 120, 240 ],
			"tetraédrica": [ 0, 90, 180, 270 ],
			"angular V": [0, 180],
			"linear": [ 0, 180 ]
		}

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

		this.atoms.push(eu)

		if (eu.ligacoes)
			eu.ligacoes.forEach(({para, eletrons=1}, eidx) => {				
				if (all[para].lido != true) {
					const filho = this.ThrowAtoms(all, para, idx, eidx, camada+1)
					this.ligations.push({a:filho, b:eu, eletrons})
				}
			})

		return eu
	}

	DrawLigation(ligation) {
		const {from, to} = ligation
	
		// Configurar Context2D
		this.ctx.strokeStyle = "#000"
		this.ctx.lineWidth = 1

		this.ctx.beginPath()
		this.ctx.moveTo(from.x - this.small_x + this.border, from.y - this.small_y + this.border)
		this.ctx.lineTo(to.x - this.small_x + this.border, to.y - this.small_y + this.border)
		this.ctx.stroke()
	}

	drawLig({a, b, eletrons=1}) {	
		const ligacao_distancia = 10
		const espaco_ligacao = 20

		this.ctx.strokeStyle = "black"
		this.ctx.lineWidth = 1

		for (let i = 0; i < eletrons; i++) {
			const ax = a.pos.x + Math.cos( ((a.angle + (i*espaco_ligacao)) + 180) / 180 * Math.PI) * ligacao_distancia
			const ay = a.pos.y + Math.sin( ((a.angle + (i*espaco_ligacao)) + 180) / 180 * Math.PI) * ligacao_distancia
			const bx = b.pos.x + Math.cos( (a.angle - (i*espaco_ligacao)) / 180 * Math.PI) * ligacao_distancia
			const by = b.pos.y + Math.sin( (a.angle - (i*espaco_ligacao)) / 180 * Math.PI) * ligacao_distancia

			this.ctx.beginPath()
			this.ctx.moveTo(ax - this.small_x + this.border, ay - this.small_y + this.border)
			this.ctx.lineTo(bx - this.small_x + this.border, by - this.small_y + this.border)
			this.ctx.stroke()
		}
	}

	DrawAtom(atom) {
		let {pos, simbolo, carga} = atom

		// Configurar Context2D
		this.ctx.fillStyle = "#000"
		this.ctx.font = '18px Courier New monospace'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline =  'middle'

		const x = pos.x - this.small_x + this.border
		const y = pos.y - this.small_y + this.border
		this.ctx.fillText(simbolo, x, y)

		this.ctx.font = '12px Courier New monospace'
		carga = carga || 0
		this.ctx.fillText(carga!=0?(carga==1?'+':(carga==-1?'-':(carga<0?'-':'+') + carga )):'', x+11, y-11)
	}
}

class LewisStructure extends Structure {
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {AtomicLigation} data
	 */
	constructor(canvas, data) {
		super(canvas)
		this.radius = 40
		this.ligation_radius = 16
		this.eletron_radius = 2
		this.ligation_distance = DegreesToRadians(16)
		this.ThrowAtoms(data)
	}

	/** Recursively Define Position of the Elements in Screen
	 * @param {import("../models/molecule.js").AtomInLigation[]} atomList
	 * @param {number} index 
	 * @param {number} order
	 * @param {number|undefined} index_dad
	 */
	ThrowAtoms(atomList, index=0, order=0, index_dad=undefined) {
		const atom = atomList[index]
		const dad = this.atoms[index_dad] || null

		const atom_data = Atom.SearchByTerm(atom.simbolo)
		const valence = atom_data.camadas[atom_data.camadas.length-1] - atom.carga

		let max_ligations = dad?.ligacoes?.length||1
		if (max_ligations % 2 != 0 && max_ligations < 3)
			max_ligations++

		const angle = (dad?.angle||0) + 360/max_ligations * order
		const angle_rad = DegreesToRadians(angle)
		const x = (dad?.pos.x||0) +  (index_dad==undefined?0:Math.cos(angle_rad)) * this.radius
		const y = (dad?.pos.y||0) + Math.sin(angle_rad) * this.radius

		const me = { ... atom, pos: {x,y}, angle }
		const my_index = this.atoms.push(me) -1

		console.log(valence)
		for (let i = 0; i < valence; i++) {
			console.log(atom.simbolo, i/2)

			if (i % 1 !== 0) {
				let ligation_angle = DegreesToRadians( 90*Math.floor(i) + 10 )

				const eletron = {
					x: this.ligation_radius * Math.cos(angle_rad+Math.PI - ligation_angle) + x,
					y: this.ligation_radius * Math.sin(angle_rad+Math.PI - ligation_angle) + y
				}
				this.ligations.push(eletron)
			}

			const ligation_angle = DegreesToRadians( 90*Math.floor(i) - (i % 1 !== 0?10:0) )
			const eletron = {
				x: this.ligation_radius * Math.cos(angle_rad+Math.PI - ligation_angle) + x,
				y: this.ligation_radius * Math.sin(angle_rad+Math.PI - ligation_angle) + y
			}
			this.ligations.push(eletron)
		}
	
		/*
		if (dad) {
			const eletrons = dad.ligacoes[order].eletrons

			for (let i = 0; i < eletrons; i++) {
				let j = 0
				switch(eletrons) {
					case 3:
						j = i-1
						break
					case 2:
						j = i==0?-1:1
				}
				const ligation_angle = this.ligation_distance*j

				if (dad?.ligacoes[order].tipo == 'covalente') {
					const eletron1 = {
						x: this.ligation_radius * Math.cos(angle_rad+Math.PI - ligation_angle) + x,
						y: this.ligation_radius * Math.sin(angle_rad+Math.PI - ligation_angle) + y
					}
					this.ligations.push(eletron1)
				}

				const eletron2 = {
					x: this.ligation_radius * Math.cos(angle_rad + ligation_angle) + dad.pos.x,
					y: this.ligation_radius * Math.sin(angle_rad + ligation_angle) + dad.pos.y
				}
				this.ligations.push(eletron2)
			}
		}*/

		atom.ligacoes?.forEach(({para}, idx) =>
			this.ThrowAtoms(atomList, para, idx, my_index) )
	}

	DrawLigation(ligation) {
		this.ctx.fillStyle = "#000"
		this.ctx.beginPath()
		this.ctx.arc(ligation.x - this.small_x + this.border, ligation.y - this.small_y + this.border, this.eletron_radius, 0, Math.PI*2)
		this.ctx.fill()
	}

	DrawAtom(atom) {
		const {pos, simbolo, carga} = atom
		this.ctx.fillStyle = "#000"
		this.ctx.font = '18px Courier New monospace'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline =  'middle'
		const x = pos.x - this.small_x + this.border
		const y = pos.y - this.small_y + this.border
		this.ctx.fillText(simbolo, x, y)
	}
}

class GeoStructure extends Structure {
	molecular_geometry = {
		"octaédrica": [270, ['t',195], ['f',165], 90, ['t',345], ['f',15]],
		"bipiramidal": [270, 180, 90, ['t',345], ['f',15]],
		"tetraédrica": [['t',25], ['f',70], 170, 270],
		"piramidal": [['t',25], ['f',70], 170],
		"trigonal plana": [30, 150, 270],
		"angular V": [45, 135],
		"angular": [149.6, 30,4],
		"linear": [ 0, 180],
		"binaria": [ 180 ]
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {AtomicLigation} data
	 */
	constructor(canvas, data) {
		super(canvas)
		this.radius = 40
		this.ligation_radius = 14
		this.triangle_piece = 13
		this.ThrowAtoms(data)
	}

	/** Recursively Define Position of the Elements in Screen
	 * @param {import("../models/molecule.js").AtomInLigation[]} atomList
	 * @param {number} [index=0] 
	 * @param {number} [order=0]
	 * @param {number|undefined} [index_dad=undefined]
	 * @param {string|null} [geo=null]
	 */
	ThrowAtoms(atomList, index=0, order=0, index_dad=undefined, geo=null) {
		const atom = atomList[index]
		const dad = this.atoms[index_dad] || null

		const geometria = this.molecular_geometry[atom.geometria]
		let angle = dad?.angle||0
		if (geo) {
			const g = geo[order]
			if (g.length)
				angle += g[1]
			else
				angle += g
		}

		const angle_rad = DegreesToRadians(angle)
		const x = (dad?.pos.x||0) + (index_dad==undefined?0:Math.cos(angle_rad)) * this.radius
		const y = (dad?.pos.y||0) + Math.sin(angle_rad) * this.radius

		const me = { ... atom, pos: {x,y}, angle }
		const my_index = this.atoms.push(me) -1

		if (dad) {
			let type = 's'
			if (geo)
				if (geo[order].length)
					type = geo[order][0]

			const from = {
				x: this.ligation_radius * Math.cos(angle_rad+Math.PI) + x,
				y: this.ligation_radius * Math.sin(angle_rad+Math.PI) + y,
				angle: dad?.angle||0
			}

			const to = {
				x: this.ligation_radius * Math.cos(angle_rad) + dad.pos.x,
				y: this.ligation_radius * Math.sin(angle_rad) + dad.pos.y,
				angle: angle
			}

			this.ligations.push({from,to,type})
		}

		atom.ligacoes?.forEach(({para}, idx) =>
			this.ThrowAtoms(atomList, para, idx, my_index, geometria) )
	}

	DrawLigation(ligation) {
		const {from, to, type} = ligation

		// Configurar Context2D
		this.ctx.strokeStyle = "#000"
		this.ctx.fillStyle = "#000"
		this.ctx.lineWidth = 1

		switch(type) {
			case 's':
				this.ctx.beginPath()
				this.ctx.moveTo( from.x - this.small_x + this.border, from.y - this.small_y + this.border )
				this.ctx.lineTo( to.x - this.small_x + this.border, to.y - this.small_y + this.border )
				this.ctx.stroke()
				break
			case 'f':
				this.ctx.beginPath()
				this.ctx.moveTo(
					to.x - this.small_x + this.border,
					to.y - this.small_y + this.border
				)
				this.ctx.lineTo(
					(to.x - this.small_x + this.border) + Math.cos( DegreesToRadians(to.angle+10) ) * 20,
					(to.y - this.small_y + this.border) + Math.sin( DegreesToRadians(to.angle+10) ) * 20
				)
				this.ctx.lineTo(
					(to.x - this.small_x + this.border) + Math.cos( DegreesToRadians(to.angle-10) ) * 20,
					(to.y - this.small_y + this.border) + Math.sin( DegreesToRadians(to.angle-10) ) * 20
				)
				this.ctx.fill()
				break
			case 't':
				const t = 7
				for (let i = 1; i < Math.ceil(t/2); i++) {
					this.ctx.beginPath()
					this.ctx.arc(
						to.x - this.small_x + this.border,
						to.y - this.small_y + this.border,
						20/t * (i*2),
						DegreesToRadians(to.angle-this.triangle_piece),
						DegreesToRadians(to.angle+this.triangle_piece),
					)
					this.ctx.arc(
						to.x - this.small_x + this.border,
						to.y - this.small_y + this.border,
						20/t * (i*2+1),
						DegreesToRadians(to.angle+this.triangle_piece),
						DegreesToRadians(to.angle-this.triangle_piece),
						true
					)
					this.ctx.fill()
				}
				break
		}
	}

	DrawAtom(atom) {
		const {pos, simbolo, carga} = atom

		// Configurar Context2D
		this.ctx.fillStyle = "#000"
		this.ctx.font = '18px Courier New monospace'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline =  'middle'

		const x = pos.x - this.small_x + this.border
		const y = pos.y - this.small_y + this.border
		this.ctx.fillText(simbolo, x, y)

		this.ctx.font = '12px Courier New monospace'
		this.ctx.fillText(carga!=0?(carga==1?'+':(carga==-1?'-':carga)):'', x+11, y-11)
	}
}

export default WinMolecula