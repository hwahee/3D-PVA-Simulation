import { Scene } from "@babylonjs/core";
import { canvasShader } from "@babylonjs/inspector/components/actionTabs/tabs/propertyGrids/materials/textures/canvasShader";
import { Movable } from "../objects/Object";
import { focusMng } from "./FocusManager";

/**
 * 카메라 - 마우스포인터 레이캐스팅 
 */
class Mouse {
	private _tempMouseCoor: { x: number, y: number } = { x: 0, y: 0 }

	constructor() { }
	init(canvas: HTMLCanvasElement, scene: Scene) {
		canvas.addEventListener("pointerdown", (e) => {
			this._tempMouseCoor = { x: e.x, y: e.y }
		})
		canvas.addEventListener("pointerup", (e) => {
			if (Math.abs(this._tempMouseCoor.x - e.x + this._tempMouseCoor.y - e.y) < 20) {		//20픽셀 이내 ◇ 모양 내에 있으면 드래그가 아닌 클릭
				//타겟의 임의 부분을 클릭해서 최종 parent까지 거슬러 올라간 다음 클릭
				let tgt: any = scene.pick(e.x, e.y)?.pickedMesh
				while (tgt.parent != null) {
					tgt = tgt.parent
				}
				tgt=tgt as Movable
				if (tgt.isSelectable && focusMng.getTarget() !== (tgt as Movable)) {
					focusMng.clearTarget()
					focusMng.setTarget(tgt)
				}
			}
		})
		canvas.addEventListener("contextmenu", (e)=>{
			if (Math.abs(this._tempMouseCoor.x - e.x + this._tempMouseCoor.y - e.y) < 20) {		//20픽셀 이내 ◇ 모양 내에 있으면 드래그가 아닌 클릭
				//타겟의 임의 부분을 클릭해서 최종 parent까지 거슬러 올라간 다음 클릭
				let tgt: any = scene.pick(e.x, e.y)?.pickedMesh
				while (tgt.parent != null) {
					tgt = tgt.parent
				}
				if (tgt) {
					focusMng.openContextMenu(tgt)	
				}
			}
		})
	}
}

const mouse: Mouse = new Mouse()
export { mouse }