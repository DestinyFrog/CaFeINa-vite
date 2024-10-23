
/**
 * change the first letter of words to upper case
 * @param {string} text
 * @return {string}
 */
export function Capitalize(text) {
	return text.split(' ').map(d => {
		if ( ['de'].includes(d) ) return d
		const e = d.split('')
		e[0] = e[0].toUpperCase()
		return e.join('')
	} ).join(' ')
}

/**
 * convert degrees to radians
 * @param {number} degrees
 */
export function DegreesToRadians(degrees) {
	return degrees / 180 * Math.PI
}

export function GenerateRandomString(length) {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}