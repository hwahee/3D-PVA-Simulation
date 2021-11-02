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
		document.addEventListener('focusout', (e)=>{
			// 키를 누른 채로 포커스가 이탈되었을 때 키가 초기화되도록
			this._keyStatus={}
		})
	}
	getKeyStatus() { return this._keyStatus }
}

const keyboard: Keyboard = new Keyboard()
export { keyboard }