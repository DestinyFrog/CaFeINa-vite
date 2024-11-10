import "./winMolecula.css"
import { Capitalize } from "../configuration"
import App from "../features/app"
import winBrowser from "./winBrowser"

class winMolecula extends App {
	constructor(data) {
		super(Capitalize(data.nomes.popular[0]), "Molecula")
		this.data = data
		this.div_container.style.minWidth = "200px"
	}

	Render(){
		this.canvas = document.createElement('canvas')
		this.canvas.className = 'in-screen'
		this.AddToContainer(this.canvas)
		this.Draw()

		const p_formula = document.createElement("p")
		p_formula.innerHTML = this.data.formula.replaceAll("<", "_")
		.replaceAll(">", "</sub>")
		.replaceAll("_", "<sub>")
		this.AddToContainer(p_formula)

		const ul_tags = document.createElement("ul")
		ul_tags.className = "tags-list"
		this.AddToContainer(ul_tags)

		this.data.caracteristicas.forEach(caracteristica => {
			const li_tag = document.createElement("li")
			li_tag.textContent = caracteristica
			li_tag.addEventListener('click', () => {
				const w = new winBrowser(caracteristica)
				w.Render()
			})
			ul_tags.appendChild(li_tag)
		})
	}

	Draw() {
		const border = 20

		const linhas = []
		const letras = []

		const precode = `
		function l3(ax, ay, bx, by, d=10, e=a(18)) {
			const ang = Math.atan2(by-ay, bx-ax)+e
			const ang2 = Math.atan2(by-ay, bx-ax)-e

			linhas.push( {
				a: {
					x: ax+Math.cos(ang)*d,
					y: ay+Math.sin(ang)*d
				},
				b: {
					x: bx+Math.cos(ang2+Math.PI)*d,
					y: by+Math.sin(ang2+Math.PI)*d
				}
			} )

			linhas.push( {
				a: {
					x: ax+Math.cos(ang2)*d,
					y: ay+Math.sin(ang2)*d
				},
				b: {
					x: bx+Math.cos(ang+Math.PI)*d,
					y: by+Math.sin(ang+Math.PI)*d
				}
			} )

						linhas.push( {
				a: {
					x: ax+Math.cos(0)*d,
					y: ay+Math.sin(0)*d
				},
				b: {
					x: bx+Math.cos(Math.PI)*d,
					y: by+Math.sin(Math.PI)*d
				}
			} )
		}

		function l2(ax, ay, bx, by, d=10, e=a(10)) {
			const ang = Math.atan2(by-ay, bx-ax)+e
			const ang2 = Math.atan2(by-ay, bx-ax)-e

			linhas.push( {
				a: {
					x: ax+Math.cos(ang)*d,
					y: ay+Math.sin(ang)*d
				},
				b: {
					x: bx+Math.cos(ang2+Math.PI)*d,
					y: by+Math.sin(ang2+Math.PI)*d
				}
			} )

			linhas.push( {
				a: {
					x: ax+Math.cos(ang2)*d,
					y: ay+Math.sin(ang2)*d
				},
				b: {
					x: bx+Math.cos(ang+Math.PI)*d,
					y: by+Math.sin(ang+Math.PI)*d
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

		let dist = 34
		` 

		eval(precode+";"+this.data.estrutura)
		
		let smallerx=1000, smallery=1000, biggerx=-1000, biggery=-1000
		letras.forEach(({x, y}) => {
			if (x<smallerx) smallerx = x
			if (y<smallery) smallery = y
			if (x>biggerx) biggerx = x
			if (y>biggery) biggery = y
		})

		const width = biggerx + Math.abs(smallerx)
		const height = biggery + Math.abs(smallery)

		const cx = border + Math.abs(smallerx)
		const cy = border + Math.abs(smallery)
		
		this.canvas.width  = width + border*2
		this.canvas.height = height + border*2

		const ctx = this.canvas.getContext('2d')

		ctx.fillStyle = 'white'
		ctx.clearRect(0,0,width + border*2,height + border*2);
		ctx.fillRect(0,0,width + border*2,height + border*2);
		ctx.fillStyle = 'black'

		letras.forEach(({s, x, y}) => {
			ctx.strokeStyle = "black"
			ctx.lineWidth = 1
			ctx.font = "13px Arial"
			ctx.textAlign = "center"
			ctx.textBaseline = "middle"
			ctx.fillText(s, x + cx, y + cy)
		})

		linhas.forEach(({a, b}) => {
			ctx.fillStyle = "black"
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.moveTo( a.x+cx, a.y+cy )
			ctx.lineTo( b.x+cx, b.y+cy )
			ctx.stroke()
		})
	}
}

export default winMolecula