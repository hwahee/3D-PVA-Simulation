import { Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { POS } from "../system/Global";
import { Movable } from "./Object";

class Chair extends Movable {
	constructor(scene:Scene, name?:string){
		super(scene, name??"Chair")
	}
	private _RoG=5 * Math.PI / 180
	async load() {
		const seat = MeshBuilder.CreateBox("Chair_seat", { width: 2, height: 0.25, depth: 2 }, this._scene)
		{
			seat.parent = this
		}

		const back=MeshBuilder.CreateBox("Chair_seat_back", { width: 2, height: 2.5, depth: 0.25 }, this._scene)
		{
			back.parent=seat
			back.position=new Vector3(0, 2.5/2, 2/2)
		}

		const legHeight = 1.5
		const leg: Mesh[] = [
			MeshBuilder.CreateCylinder("Chair_seat_legFL", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Chair_seat_legFR", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Chair_seat_legRL", { diameter: 0.2, height: legHeight }, this._scene),
			MeshBuilder.CreateCylinder("Chair_seat_legRR", { diameter: 0.2, height: legHeight }, this._scene),]
		{
			leg.forEach((i) => {
				i.parent = seat
				//i.rotation = new Vector3(Math.PI * 0.5, 0, 0)
			})
			let offsetX = 0.9
			let offsetZ = 0.9
			leg[POS.FL].position = new Vector3(offsetX, legHeight / -2, -offsetZ)
			leg[POS.FR].position = new Vector3(-offsetX, legHeight / -2, -offsetZ)
			leg[POS.RL].position = new Vector3(offsetX, legHeight / -2, offsetZ)
			leg[POS.RR].position = new Vector3(-offsetX, legHeight / -2,offsetZ)
		}

		this.position = new Vector3(6, 2, 0)
	}
}

export { Chair }