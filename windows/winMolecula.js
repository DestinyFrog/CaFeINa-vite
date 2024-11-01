import { Capitalize } from "../configuration"
import App from "../features/app"

class winMolecula extends App {
	constructor(data) {
		super(Capitalize(data.nomes.popular[0]), "Molecula")
		this.data = data
	}

	Render(){
		this.canvas = document.createElement('canvas')
		this.canvas.className = 'in-screen'
		this.AddToContainer(this.canvas)
		this.Draw()
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
		}

		this.structure.Draw()
	}

	Render() {
		this.canvas = document.createElement('canvas')
		this.canvas.className = 'in-screen'
		this.AddToContainer(this.canvas)
	
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

	Draw() {
		const border = 20

		const linhas = []
		const letras = []

		const ctx = this.canvas.getContext('2d')

		function l2(ax, ay, bx, by, d=10, e=a(12)) {
			const ang = Math.atan2(by-ay, bx-ax)
			linhas.push( {
				a: {
					x: ax+Math.cos(ang+e)*d,
					y: ay+Math.sin(ang-e)*d
				},
				b: {
					x: bx+Math.cos(ang+Math.PI-e)*d,
					y: by+Math.sin(ang+Math.PI+e)*d
				}
			} )

			linhas.push( {
				a: {
					x: ax+Math.cos(ang-e)*d,
					y: ay+Math.sin(ang+e)*d
				},
				b: {
					x: bx+Math.cos(ang+Math.PI+e)*d,
					y: by+Math.sin(ang+Math.PI-e)*d
				}
			} )
		}

		function l1(ax, ay, bx, by, d1=10, d2=10) {
			const ang = Math.atan2(by-ay, bx-ax)
			linhas.push( {
				a: {
					x: ax+Math.cos(ang)*d1,
					y: ay+Math.sin(ang)*d1
				},
				b: {
					x: bx+Math.cos(ang+Math.PI)*d2,
					y: by+Math.sin(ang+Math.PI)*d2
				}
			} )
		}

		function p(symbol, x, y) { letras.push( {s: symbol, x, y} ) }
		function a(angle) { return angle / 180 * Math.PI }

		let dist = 40

		eval(this.data.estrutura)

		let smallerx=0, smallery=0, biggerx=0, biggery=0
		letras.forEach(({x, y}) => {
			if (x<smallerx) smallerx = x
			if (y<smallery) smallery = y
			if (x>biggerx) biggerx = x
			if (y>biggery) biggery = y
		})

		const width = biggerx - smallerx
		const height = biggery - smallery

		const cx = width/2 + border
		const cy = height/2 + border
		
		this.canvas.width  = width + border*2
		this.canvas.height = height + border*2

		letras.forEach(({s, x, y}) => {
			ctx.strokeStyle = "black"
			ctx.lineWidth = 1
			ctx.font = "13px Arial"
			ctx.textAlign = "center"
			ctx.textBaseline = "middle"
			ctx.fillText(s, x + cx, y + cy)
		})

		linhas.forEach(({a, b}) => {
			ctx.strokeStyle = "black"
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.moveTo( a.x+cx, a.y+cy )
			ctx.lineTo( b.x+cx, b.y+cy )
			ctx.stroke()
		})
	}
}

<<<<<<< HEAD
export default winMolecula
=======
export default WinMolecula
>>>>>>> a30eaa3967b3de7c757bf12de283c7c4ec649e43
