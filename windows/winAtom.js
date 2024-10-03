import { Capitalize } from "../configuration.js"
import App from "../features/app.js"

// Atom configurations
const ELETRON_SPEED_LEVELS = [0, 1, 2, 5, 10, 20, 100]
const ELETRON_RADIUS = 2
const ELETRON_ANGULAR_SPEED = 0.03
const ELETRON_LAYER_COLOR = '#000'
const ELETRON_COLOR = '#0000ff'
const ATOMIC_RADIUS_WEIGHT = 0.5
const PROTON_RADIUS = 4
const PROTON_COLOR = "#FF0000"
const NEUTRON_COLOR = "#00FF00"
const CORE_RADIUS = 8
const ATOMIC_RADIUS_DEFAULT = 200

// Canvas Configuration
const CANVAS_BACKGROUND_COLOR = "#fff"

// Frames
const DELAY = 40

class WinAtom extends App {
	velocity_index = 1
	eletrons_angle = 0
	border = 20

	/**
	 * @param {import("../models/atom.js").Atom} atom atom to be renderized
	 */
	constructor(atom) {
		super( Capitalize(atom.nome) )
		this.atom = atom

		this.WIDTH = (this.atom.raio_atomico || ATOMIC_RADIUS_DEFAULT) * ATOMIC_RADIUS_WEIGHT*2 + this.border*2
		this.HEIGHT = (this.atom.raio_atomico || ATOMIC_RADIUS_DEFAULT) * ATOMIC_RADIUS_WEIGHT*2 + this.border*2
		this.CENTER = { x: this.WIDTH/2, y: this.HEIGHT/2 }
	}

	Render() {
		const canvas = document.createElement('canvas')
		canvas.className = 'in-screen'
		this.AddToContainer(canvas)

		canvas.width = this.WIDTH
		canvas.height = this.HEIGHT

		this.ctx = canvas.getContext('2d')
		this.ctx.lineWidth = 1

		// Botao que altera a velocidade
		const velocity_button = document.createElement('button')
		velocity_button.className = 'velocity-button'
		velocity_button.textContent = `${ELETRON_SPEED_LEVELS[this.velocity_index]}x`
		velocity_button.addEventListener('click', _ => {
			this.velocity_index++
			if (this.velocity_index>= ELETRON_SPEED_LEVELS.length)
				this.velocity_index= 0

			velocity_button.textContent = `${ELETRON_SPEED_LEVELS[this.velocity_index]}x`
		})
		this.AddToFooter(velocity_button)

		requestAnimationFrame( () => this.Draw() )
	}

	RestartCanvas() {
		this.ctx.fillStyle = CANVAS_BACKGROUND_COLOR
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT)
	}

	Draw() {
		// if velocity equals to 0
		// jump update of canvas
		if (ELETRON_SPEED_LEVELS[this.velocity_index] != 0) {

			// Update eletron angle based on angular velocity
			if(this.eletrons_angle > (Math.PI*2) - ELETRON_ANGULAR_SPEED)
				this.eletrons_angle = this.eletrons_angle - (Math.PI*2) + ELETRON_ANGULAR_SPEED
			else
				this.eletrons_angle += ELETRON_ANGULAR_SPEED * ELETRON_SPEED_LEVELS[this.velocity_index]

			this.RestartCanvas()

			// Draw Protons
			this.ctx.fillStyle = PROTON_COLOR
			for (let i = 0; i < this.atom.numero_atomico; i++) {
				const angle = Math.floor(Math.random() * ELETRON_SPEED_LEVELS[this.velocity_index] * (Math.PI*2))
				const distance = Math.floor(Math.random() * CORE_RADIUS)

				const x = this.CENTER.x + Math.cos(angle) * distance
				const y = this.CENTER.y + Math.sin(angle) * distance

				if (i%2==0)
					this.ctx.fillStyle = PROTON_COLOR
				else
					this.ctx.fillStyle = NEUTRON_COLOR

				this.ctx.beginPath()
				this.ctx.arc(x, y, PROTON_RADIUS, 0, (Math.PI*2))
				this.ctx.fill()
				this.ctx.closePath()
			}

			// Draw Layers
			this.ctx.strokeStyle = ELETRON_LAYER_COLOR
			for (let i = 1; i <= this.atom.periodo; i++) {
				const radius = (this.atom.raio_atomico || ATOMIC_RADIUS_DEFAULT)*ATOMIC_RADIUS_WEIGHT/this.atom.periodo*i + CORE_RADIUS

				this.ctx.beginPath()
				this.ctx.arc(this.CENTER.x, this.CENTER.y, radius, 0, (Math.PI*2))
				this.ctx.stroke()
				this.ctx.closePath()
			}

			// Draw eletrons
			this.ctx.fillStyle = ELETRON_COLOR
			for (let i = 0; i < this.atom.periodo; i++) {
				// Iterate over each layer

				for (let j = 1; j <= this.atom.camadas[i]; j++) {
					// Draw eletron
					const angle = ((Math.PI*2) / this.atom.camadas[i] * j) + this.eletrons_angle
					const distance = (this.atom.raio_atomico || ATOMIC_RADIUS_DEFAULT)*ATOMIC_RADIUS_WEIGHT / this.atom.periodo*(1+i) + CORE_RADIUS

					const x = this.CENTER.x + Math.cos(angle) * distance
					const y = this.CENTER.y + Math.sin(angle) * distance

					this.ctx.beginPath()
					this.ctx.arc(x, y, ELETRON_RADIUS, 0, (Math.PI*2))
					this.ctx.fill()
					this.ctx.closePath()
				}
			}
		}

		setTimeout( () => requestAnimationFrame( () => this.Draw() ), DELAY)
	}
}

export default WinAtom