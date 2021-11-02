import { ArcRotateCamera, Camera, FreeCamera, Mesh, MeshBuilder, Scene, TransformNode, Vector3, VectorSplitterBlock } from "@babylonjs/core";
import { POS } from "../system/Global";
import { keyboard } from "../system/Keyboard";
import { Movable } from "./Object";
import { PVA } from "./PVA";

class Player extends Movable {
	async load() {
		const head = MeshBuilder.CreateSphere("Player_head", { diameter: 1 }, this._scene)
		{
			head.parent = this
			head.position = new Vector3(0, 1.5, 0)
		}
		const ear: Mesh[] = [
			MeshBuilder.CreateCylinder("Player_head_earL", { diameter: 0.4, height: 0.2 }, this._scene),
			MeshBuilder.CreateCylinder("Player_head_earR", { diameter: 0.4, height: 0.2 }, this._scene)]
		{
			ear.forEach((i) => {
				i.parent = head
				i.rotation = new Vector3(Math.PI * 0.5, 0, 0)
			})
			ear[POS.L].position = new Vector3(-1, 1, 0).normalize().scale(0.5)
			ear[POS.R].position = new Vector3(1, 1, 0).normalize().scale(0.5)
		}
		const nose = MeshBuilder.CreateSphere("Player_head_nose", { diameter: 0.4 }, this._scene)
		{
			nose.parent = head
			nose.position = new Vector3(0, -0.15, -0.5)
		}
		const body = MeshBuilder.CreateCylinder("Player_body", { height: 2, diameterTop: 1, diameterBottom: 1.5 }, this._scene)
		{
			body.parent = this
			body.position = new Vector3(0, 1, 1).normalize().scale(2)
			body.rotation = new Vector3(Math.PI / 2 * -1, 0, 0)
		}
		const legHeight = 1.5
		const leg: Mesh[] = [
			MeshBuilder.CreateCylinder("Player_body_legFL", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Player_body_legFR", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Player_body_legRL", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Player_body_legRR", { diameter: 0.2, height: legHeight }, this._scene),]
		{
			leg.forEach((i) => {
				i.parent = body
				i.rotation = new Vector3(Math.PI * 0.5, 0, 0)
			})
			let offsetX = 0.4
			let offsetY = 0.8
			leg[POS.FL].position = new Vector3(offsetX, offsetY, legHeight / -2)
			leg[POS.FR].position = new Vector3(offsetX, -offsetY, legHeight / -2)
			leg[POS.RL].position = new Vector3(-offsetX, offsetY, legHeight / -2)
			leg[POS.RR].position = new Vector3(-offsetX, -offsetY, legHeight / -2)
		}

		this.position = new Vector3(0, 1, 0)
	}
}

export { Player }