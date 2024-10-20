import winBrowser from "../windows/winBrowser.js"
import WinLinusPauling from "../windows/winLinusPauling.js"
import WinPeriodicTable from "../windows/winPeriodicTable.js"
import App from "./app.js"

import iconTabelaPeriodica from "/icons/iconPeriodicTable.svg"
import iconLinusPauling from "/icons/iconLinusPauling.svg"
import iconSearch from "/icons/iconSearch.svg"
import iconClear from "/icons/iconClear.svg"

const icons = [
	{
		name: "tabela-periodica",
		icon: iconTabelaPeriodica,
		title: "Tabela Periódica",
		color: "#4169e1",
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
		icon: iconSearch,
		title: "Navegador",
		action: () => {
			const w = new winBrowser()
			w.Render()
		}
	},
	{
		name: "clear",
		icon: iconClear,
		title: "Limpar",
		action: () =>
			App.Clear()
	}
]

export default icons