import App from "../features/app.js"
import Atom from "../models/atom.js"
import WinElement from "./winElement.js"
import WinMolecula from "./winMolecula.js"

import './winBrowser.css'
import Molecula from "../models/molecula.js"

class winBrowser extends App {
    constructor(procura) {
        super("Navegador")
        this.procura = procura
    }

    Render() {
        const bar = document.createElement('div')
        bar.className = 'browser-bar'
        this.AddToContainer(bar)

        this.recomendation = document.createElement('ul')
        this.recomendation.className = 'browser-ul-recomendation'
        this.AddToContainer(this.recomendation)

        const search_input = document.createElement('input')
        search_input.type = 'text'
        search_input.addEventListener('input', () => {
            this.SearchFor(search_input.value)
        })
        bar.appendChild(search_input)

    }

    async SearchFor(term) {
const Els = []
this.recomendation.innerHTML = ''

        if (term == '')
            return

        const list_atom = Atom.SearchManyByTerm(term).sort(({ numero_atomico:n1}, {numero_atomico:n2}) => n1 > n2?1:-1)
        list_atom.forEach(m => {
            const li = document.createElement('li')

            const nome_p = document.createElement('p')
            nome_p.textContent = `${m.numero_atomico} - ${m.nome}`
            li.appendChild(nome_p)

            const simbolo_p = document.createElement('p')
            simbolo_p.textContent = m.simbolo
            li.appendChild(simbolo_p)

            li.addEventListener('click', () => {
                const w = new WinElement(m)
                w.Render()
            })

Els.push(li)
        
        })

        const hr = document.createElement('hr')
Els.push(hr)

        const data2 = await Molecula
		.SearchManyByTerm(term)

this.recomendation.innerHTML = ''
		
data2.forEach(
                m => {
                    const li = document.createElement('li')
                    let formula = m.formula.split(/(_\d)/)
                    formula = formula.map(as => {  
                        if (as.startsWith('_'))
                            return `<sub>${as.slice(1)}</sub>`
                        return as
                    }).join("")

                    const nome_p = document.createElement('p')
                    nome_p.textContent = m.nome[0]
                    li.appendChild(nome_p)

                    const formula_p = document.createElement('p')
                    formula_p.style.textAlign = 'right'
                    formula_p.innerHTML = formula
                    li.appendChild(formula_p)

                    li.addEventListener('click', () => {
                        const w = new WinMolecula(m)
                        w.Render()
                    })
                    Els.push(li)
                }
            )

this.recomendation.innerHTML = ''
Els.forEach(this.recomendation.appendChild)
    }
}

export default winBrowser