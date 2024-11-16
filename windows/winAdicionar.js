import App from "../features/app.js"
import client from "../db/client.js"

class winAdicionar extends App {
    code = ``

    constructor() {
        super("Adicionar Moléculas")

        this.div_container.style = "display:flex; flex-direction:row;"
    }

    Render() {
        this.nav = document.createElement("nav")
        this.AddToContainer(this.nav)

        const h1_nome = document.createElement("h3")
        h1_nome.textContent = "nome popular"
        this.nav.appendChild(h1_nome)

        this.input_nome = document.createElement("input")
        this.input_nome.type = "text"
        this.nav.appendChild(this.input_nome)

        // ----
        
        this.h1_nome2 = document.createElement("h3")
        this.h1_nome2.textContent = "nome técnico"
        this.nav.appendChild(this.h1_nome2)
        
        this.input_nome2 = document.createElement("input")
        this.input_nome2.type = "text"
        this.nav.appendChild(this.input_nome2)

        // ----

        const h1_formula = document.createElement("h3")
        h1_formula.textContent = "fórmula"
        this.nav.appendChild(h1_formula)

        this.input_formula = document.createElement("input")
        this.input_formula.type = "text"
        this.nav.appendChild(this.input_formula)

		// ----

		const h1_procura = document.createElement("h3")
		h1_procura.textContent = "procura"
		this.nav.appendChild(h1_procura)

		this.input_procura = document.createElement("input")
		this.input_procura.type = "text"
		this.nav.appendChild(this.input_procura)

        // ----
        
        const h1_caracteristicas = document.createElement("h3")
        h1_caracteristicas.textContent = "características"
        this.nav.appendChild(h1_caracteristicas)
        
        this.input_caracteristicas = document.createElement("textarea")
        this.input_caracteristicas.cols = 15
        this.input_caracteristicas.rows = 4
        this.nav.appendChild(this.input_caracteristicas)

        // ----

        this.div = document.createElement("div")
        this.AddToContainer(this.div)
    
        this.canvas = document.createElement("canvas")
        this.div.appendChild(this.canvas)

        this.textarea = document.createElement("textarea")
        this.textarea.value = this.code
        this.textarea.cols = 40
        this.textarea.rows = 10
        this.div.appendChild(this.textarea)
        this.textarea.addEventListener('input', (ev) => {
            this.code = this.textarea.value
            this.Update()
        })

        this.button = document.createElement("button")
        this.button.addEventListener('click', () => {
            this.Send()
        })
        this.button.textContent = "Enviar"
        this.AddToFooter(this.button)

        this.cbutton = document.createElement("button")
        this.cbutton.addEventListener('click', () => {
            this.Clear()
        })
        this.cbutton.textContent = "Limpar"
        this.AddToFooter(this.cbutton)

        this.Update()
    }

    async Send() {
        const obj = {
            nome: {
                oficial: this.input_nome2.value.split(";"),
                popular: this.input_nome.value.split(";")
            },
            formula: this.input_formula.value,
            caracteristicas: this.input_caracteristicas.value.split(";"),
            estrutura: this.code.replaceAll(";\n",";"),
			procura: this.input_procura.value
        }

        console.log(obj)
        const sql = `
        INSERT INTO molecula (nome, formula, caracteristicas, estrutura, procura)
        VALUES ('${JSON.stringify(obj.nome)}', '${obj.formula}', '${JSON.stringify(obj.caracteristicas)}', '${obj.estrutura}', '${obj.procura}');
        `

        await client.execute(sql)
        .then(_ => {
            this.Clear()
        })
    }

    Update() {
		const border = 20

		const linhas = []
		const letras = []

		const precode = `
		function l3(ax, ay, bx, by, d=10, e=a(18)) {
			const ang = Math.atan2(by-ay, bx-ax)+e
			const ang2 = Math.atan2(by-ay, bx-ax)-e
			const ang3 = Math.atan2(by-ay, bx-ax)

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
					x: ax+Math.cos(ang3)*d,
					y: ay+Math.sin(ang3)*d
				},
				b: {
					x: bx+Math.cos(ang3+Math.PI)*d,
					y: by+Math.sin(ang3+Math.PI)*d
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

		eval(precode+";"+this.code)
		
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

    Clear() {
        this.input_nome.value = ""
        this.input_nome2.value = ""
        this.input_formula.value = ""
        this.input_caracteristicas.value = ""
        this.code = ""
        this.textarea.value = ""
		this.input_procura.value = ""
        this.Update()
    }
}

export default winAdicionar