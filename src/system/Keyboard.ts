class Keyboard {
	private _keyStatus: { [key: string]: boolean } = {}
	constructor() {
		this.init()
	}
	init() {
		document.addEventListener('keydown', (e) => {
			this._keyStatus[e.key] = true
		})
		document.addEventListener('keyup', (e) => {
			this._keyStatus[e.key] = false
		})
	}
	getKeyStatus() { return this._keyStatus }
}

const keyboard: Keyboard = new Keyboard()
export { keyboard }