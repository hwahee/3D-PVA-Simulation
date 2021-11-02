import { Movable } from "../objects/Object"

class FocusManager {
	private _target: Movable | undefined
	constructor() {
	}
	setTarget(target: Movable) {
		this.clearTarget()
		this._target = target
		target.focusIn()
	}
	clearTarget() {
		this._target?.focusOut()
		this._target = undefined
	}
}

const FocusMng: FocusManager = new FocusManager()
export { FocusMng }