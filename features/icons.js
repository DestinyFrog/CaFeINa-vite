import winBrowser from "../windows/winBrowser.js"
import WinLinusPauling from "../windows/winLinusPauling.js"
import WinPeriodicTable from "../windows/winPeriodicTable.js"
import App from "./app.js"

import iconTabelaPeriodica from "../public/icons/iconPeriodicTable.svg"
import iconLinusPauling from "../public/icons/iconLinusPauling.svg"

const icons = [
	{
		name: "tabela-periodica",
		icon: iconTabelaPeriodica,
		title: "Tabela Periódica",
		action: () => {
			const w = new WinPeriodicTable()
			w.Render()
		}
	},
	{
		name: "linus-pauling",
		icon: iconLinusPauling,
		title: "Diagrama de Linus Pauling",
		action: () => {
			const w = new WinLinusPauling()
			w.Render()
		}
	},
    {
		name: "browser",
		icon: "",
		title: "Navegador",
		action: () => {
			const w = new winBrowser()
			w.Render()
		}
	},
	{
		name: "clear",
		icon: "",
		title: "Limpar",
		action: () =>
			App.Clear()
	}
]

export default icons