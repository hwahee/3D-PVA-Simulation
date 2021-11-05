import { Movable } from "../objects/Object"

class FocusManager {
	private _target: Movable | undefined
	constructor() {
	}
	getTarget(): Movable { return (this._target as Movable) ?? null }
	setTarget(target: Movable) {
		this.clearTarget()
		this._target = target
		target.focusIn()
	}
	clearTarget() {
		this._target?.focusOut()
		this._target = undefined
	}
	openContextMenu(tgt: Movable) {
		if(this._target===tgt){
			this._target.openInterface()
		}
		else{

		}
	}
}

const focusMng: FocusManager = new FocusManager()
export { focusMng }