import { ArcRotateCamera, Camera, FreeCamera, Mesh, MeshBuilder, Scene, TransformNode, Vector3, VectorSplitterBlock } from "@babylonjs/core";
import { keyboard } from "../system/Keyboard";
import { PVA } from "./PVA";

enum POS { L, R, FL = 0, FR, RL, RR }

class Player extends TransformNode {
	private _selected: boolean = false
	private _pva:PVA=new PVA()

	constructor(scene: Scene) {
		super("Player", scene)
	}
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

		this.attachMove()
	}

	attachMove(){
		const SPEED = 0.2
		const RoG = 2 * Math.PI / 180
		const GRAVITY = -0.2
		const JUMP = 20
		this._pva.setFrontAcc(0.01, 0.4)
		this._pva.setSideAcc(0.01, 0.4)

		setInterval(() => {
			const keystat = keyboard.getKeyStatus()

			const dYaw = ((keystat.q ? -1 : 0) + (keystat.e ? 1 : 0)) * RoG
			this.rotation.set(this.rotation.x, this.rotation.y + dYaw, this.rotation.z)

			this._pva.moveFront((keystat.w ? -1 : 0) + (keystat.s ? 1 : 0))
			this._pva.moveSide((keystat.d? -1 : 0) + (keystat.a ? 1 : 0))

			let out_vel:Vector3=Vector3.Zero()
			this._pva.getNormalizedVel().rotateByQuaternionToRef(this.rotation.toQuaternion(), out_vel)

			this.position.addToRef(out_vel, this.position)
		}, 40)
	}

	setCameraToThis(cam: ArcRotateCamera | FreeCamera) {
		cam.setTarget(this.position)
	}
}

export { Player }