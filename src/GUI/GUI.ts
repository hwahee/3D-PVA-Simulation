import { Scene, TargetCamera, WebXRHitTest } from "@babylonjs/core"
import * as GUI from "@babylonjs/gui"
import { AdvancedDynamicTextureTreeItemComponent } from "@babylonjs/inspector/components/sceneExplorer/entities/gui/advancedDynamicTextureTreeItemComponent"
import { Movable } from "../objects/Object"

class GUIManager {
	private _advTexture: GUI.AdvancedDynamicTexture | undefined
	constructor(advTexture?: GUI.AdvancedDynamicTexture) {
		this._advTexture = advTexture
	}
	init(advTexture: GUI.AdvancedDynamicTexture) {
		delete this._advTexture
		this._advTexture = advTexture
	}
	setAdvTextureToRemote(name: string, scene: Scene): GUI.AdvancedDynamicTexture {
		return GUI.AdvancedDynamicTexture.CreateFullscreenUI(name)
	}
	setNameTag(name: string, op: {
		innerText?: string, fontSize?: number, color?: string, offsetY?: number
	}, target: Movable): void {
		const n = new GUI.TextBlock(name, op.innerText ?? "DEFAULT NAMETAG")
		n.fontSize = op.fontSize ?? 10
		n.color = op.color ?? "black"

		target.advTexture?.addControl(n)
		n.linkWithMesh(target)
		n.linkOffsetY = op.offsetY ?? -20
	}
	setBtn(name: string, op: {
		innerText?: string, w?: number | string, h?: number | string, color?: string, bgcolor?: string, top?: string, left?: string, thick?: number, vAlign?: number, hAlign?: number
	}, target?: Movable): void {
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

		if(target){
			target.advTexture.addControl(b)
			b.linkWithMesh(target)
		}
		else{
			this._advTexture?.addControl(b)
		}
	}
	setFnByName(name: string, fn: () => void, target?: Movable) {
		const targetAdvTexture: GUI.AdvancedDynamicTexture = (target) ? target.advTexture : this._advTexture
		targetAdvTexture?.rootContainer.children
			.filter((i) => (i.name == name))
			.forEach((i) => {
				i.onPointerUpObservable.add(fn)
			})
	}
	/**
	 * 이름을 토대로 advTexture 안의 gui객체를 제거한다.
	 * target이 주어지지 않았으면 글로벌 gui,
	 * target이 주어졌으면 Movable 안의 gui
	 */
	removeByName(name: string, target?: Movable) {
		const targetAdvTexture: GUI.AdvancedDynamicTexture = (target) ? target.advTexture : this._advTexture
		targetAdvTexture?.rootContainer.children
			.filter((i) => (i.name == name))
			.forEach((i) => {
				targetAdvTexture?.removeControl(i)
			})
	}
}

const gui = new GUIManager()
export { gui }