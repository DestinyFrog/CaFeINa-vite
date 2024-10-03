import { Capitalize } from "../configuration.js"
import App from "../features/app.js"

class WinLinusPauling extends App {
	BORDA = 16
	UNIDADE = 30

	camadas = [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q' ]
	diagramas = [
		{
			min: 1,
			max: 7,
			eletrons: 2,
			sublevel: 's'
		},
		{
			min: 2,
			max: 7,
			eletrons: 6,
			sublevel: 'p'
		},
		{
			min: 3,
			max: 6,
			eletrons: 10,
			sublevel: 'd'
		},
		{
			min: 4,
			max: 5,
			eletrons: 14,
			sublevel: 'f'
		}
	]

	/**
	 * @param {import("../models/atom.js").Atom|null} atomo
	*/
	constructor(atomo=null) {
		super("Diagrama de Linus Pauling" + (atomo ? ("- "+ Capitalize(atomo.nome) ) : "") )

		const canvas = document.createElement('canvas')
		canvas.className = 'in-screen'
		this.AddToContainer(canvas)

		this.atomo = atomo

		this.LARGURA = this.BORDA * 2 + this.UNIDADE * 5
		this.ALTURA = this.BORDA * 2 + this.UNIDADE * 7
		canvas.width = this.LARGURA
		canvas.height = this.ALTURA

		this.ctx = canvas.getContext('2d')
		this.ctx.lineWidth = 2
		this.ctx.textAlign = 'left'
	}

	Render() {
		this.ctx.fillStyle = '#000000'
		this.ctx.fillRect(0,0,this.LARGURA,this.ALTURA)

		this._Desenhar_Setas()
		this._Desenhar_Diagrama()
		this._Desenhar_Letras()

		// if (this.atomo!=null) {
		// 	const legenda = document.createElement('p')
		// 	legenda.textContent = this.atomo.configuracao_eletronica
		// 	this.AddToFooter(legenda)
		// }
	}

	_Desenhar_Diagrama() {
		let configuracao_eletronica = null
		if (this.atomo) {
			console.log(this.atomo)
			const l = this.atomo.configuracao_eletronica.split(' ')
			configuracao_eletronica = l[l.length-1]
		}

		this.diagramas.forEach((diagrama, idx) => {
			for (let i = diagrama.min; i <= diagrama.max; i++) {
				this.ctx.fillStyle = '#fff'

				if (configuracao_eletronica) {
					const txt = `${i}${diagrama.sublevel}`
					if (configuracao_eletronica.includes(txt)) {
						this.ctx.fillStyle = '#0f0'
					}
				}

				this.ctx.font = (this.UNIDADE-12).toString()+'px Arial'
				const ax = this.BORDA + this.UNIDADE * (idx+1) + 6 
				const ay = this.BORDA + this.UNIDADE * i - 6
				this.ctx.fillText(`${i}${diagrama.sublevel}`, ax, ay)
	
				this.ctx.font = (this.UNIDADE-20).toString()+'px Arial'
				const bx = this.BORDA + this.UNIDADE * (idx+1) + (this.UNIDADE-4)
				const by = this.BORDA + this.UNIDADE * (i-1) + 16
				this.ctx.fillText(diagrama.eletrons.toString(), bx, by)
			}
		})
	}

	_Desenhar_Letras() {
		this.ctx.font = (this.UNIDADE-14).toString()+'px Arial'

		this.camadas.forEach((camada, i) => {
			this.ctx.fillStyle = '#fff'
			const x = this.BORDA + 8
			const y = this.BORDA + this.UNIDADE*(i+1) - 3
			this.ctx.fillText(camada, x, y)
		})
	}

	_Desenhar_Setas() {
		// desenhar linhas
		this.ctx.strokeStyle = '#444'

		for (let i = 0; i <= 6; i++) {
			this.ctx.moveTo( this.BORDA+ this.UNIDADE*(Math.floor(i/2+0.1)+2), this.BORDA + this.UNIDADE*Math.ceil(i/2) )
			this.ctx.lineTo( this.BORDA+this.UNIDADE, this.BORDA + this.UNIDADE*(i+1) )
			this.ctx.closePath()
		}

		this.ctx.moveTo( this.BORDA+this.UNIDADE*5, this.BORDA + this.UNIDADE*4 )
		this.ctx.lineTo( this.BORDA+this.UNIDADE*2, this.BORDA + this.UNIDADE*7 )
		this.ctx.closePath()

		this.ctx.stroke()

		// desenhar triangulos
		const a = 6
		this.ctx.beginPath()
		this.ctx.fillStyle = "#444"

		for (let b = 1; b < 8; b++) {
			this.ctx.moveTo( this.BORDA+this.UNIDADE, this.BORDA+this.UNIDADE*b )
			this.ctx.lineTo( this.BORDA+this.UNIDADE, this.BORDA+this.UNIDADE*b-a )
			this.ctx.lineTo( this.BORDA+this.UNIDADE+a, this.BORDA+this.UNIDADE*b )
		}

		this.ctx.moveTo( this.BORDA+this.UNIDADE*2, this.BORDA+this.UNIDADE*7 )
		this.ctx.lineTo( this.BORDA+this.UNIDADE*2, this.BORDA+this.UNIDADE*7-a )
		this.ctx.lineTo( this.BORDA+this.UNIDADE*2+a, this.BORDA+this.UNIDADE*7 )

		this.ctx.closePath()
		this.ctx.fill()
	}
}

export default WinLinusPauling