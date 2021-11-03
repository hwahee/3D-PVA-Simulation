import { AbstractMesh, AnimationGroup, ArcRotateCamera, Camera, FreeCamera, Mesh, MeshBuilder, Scene, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core";
import { keyboard } from "../system/Keyboard";
import { PVA } from "./PVA";

class Movable extends TransformNode {
	static FRONT_ACC:number=0.01
	static FRONT_VEL_MAX:number=1
	static SIDE_ACC:number=0.01
	static SIDE_VEL_MAX:number=0.5 
	static RoG:number = 2 * Math.PI / 180
	readonly isSelectable:boolean=true

	private _selected: boolean = false
	private _pva: PVA = new PVA()
	private _movementInterval: NodeJS.Timer | undefined
	
	constructor(scene: Scene) {
		super("Movable", scene)

		this._pva.setFrontAcc(Movable.FRONT_ACC, Movable.FRONT_VEL_MAX)
		this._pva.setSideAcc(Movable.SIDE_ACC, Movable.SIDE_VEL_MAX)
	}

	async load() {
		const heart: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, this._scene)
		heart.parent = this

		this.position = new Vector3(0, 4, 10)
	}

	showNametag(){

	}
	hideNametag(){

	}

	attachMove() {
		this._movementInterval = setInterval(() => {
			const keystat = keyboard.getKeyStatus()

			const dYaw = ((keystat.q ? -1 : 0) + (keystat.e ? 1 : 0)) * Movable.RoG
			this.rotation.set(this.rotation.x, this.rotation.y + dYaw, this.rotation.z)

			this._pva.moveFront((keystat.w ? -1 : 0) + (keystat.s ? 1 : 0))
			this._pva.moveSide((keystat.d ? -1 : 0) + (keystat.a ? 1 : 0))

			let out_vel: Vector3 = Vector3.Zero()
			this._pva.getNormalizedVel().rotateByQuaternionToRef(this.rotation.toQuaternion(), out_vel)

			this.position.addToRef(out_vel, this.position)
		}, 40)
	}
	detachMove() {
		if (this._movementInterval) {
			clearInterval(this._movementInterval)
		}
		this._pva.reset()
	}

	/**
	 * 포커스 인 되었을 때 가능해지는 기능들을 설정한다.
	 */
	focusIn(){
		console.log("focus in")
		this._selected=true
		this.attachMove()
	}
	focusOut(){
		this._selected=false
		this.detachMove()
	}

	setCameraToThis(cam: ArcRotateCamera | FreeCamera) {
		cam.setTarget(this.position)
	}
}

export { Movable }