import * as GUI from "@babylonjs/gui"

class GUIManager {
	private _advTexture: GUI.AdvancedDynamicTexture|undefined
	constructor(advTexture?: GUI.AdvancedDynamicTexture) {
		this._advTexture = advTexture
	}
	init(advTexture: GUI.AdvancedDynamicTexture) {
		delete this._advTexture
		this._advTexture=advTexture
	}
	setBtn(name: string, op: { innerText?: string, w?: number | string, h?: number | string, color?: string, bgcolor?: string, top?: string, left?: string, thick?: number, vAlign?: number, hAlign?: number }): void {
		const b = GUI.Button.CreateSimpleButton(name, op.innerText ?? "")
		b.width = op.w ?? b.width
		b.height = op.h ?? b.height
		b.color = op.color ?? b.color
		b.background = op.bgcolor ?? b.background
		b.top = op.top ?? b.top
		b.left = op.left ?? b.left
		b.thickness = op.thick ?? b.thickness
		b.verticalAlignment = op.vAlign ?? b.verticalAlignment
		b.horizontalAlignment = op.hAlign ?? b.horizontalAlignment

		this._advTexture?.addControl(b)
	}
	setFnByName(name:string, fn:()=>void){
		this._advTexture?.rootContainer.children
		.filter((i) => (i.name == name))
		.forEach((i)=>{
			i.onPointerUpObservable.add(fn)
		})
	}
	removeByName(name:string){
		this._advTexture?.rootContainer.children
		.filter((i) => (i.name == name))
		.forEach((i)=>{
			this._advTexture?.removeControl(i)
		})
	}
}

const gui=new GUIManager()
export { gui }