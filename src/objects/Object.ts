import { AbstractMesh, AnimationGroup, ArcRotateCamera, Camera, FreeCamera, Mesh, MeshBuilder, Scene, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core";
import { gui } from "../gui/GUI";
import { keyboard } from "../system/Keyboard";
import { PVA } from "../engine/PVA";

class Movable extends TransformNode {
	static FRONT_ACC: number = 0.01
	static FRONT_VEL_MAX: number = 1
	static SIDE_ACC: number = 0.01
	static SIDE_VEL_MAX: number = 0.5
	static RoG: number = 2 * Math.PI / 180
	readonly isSelectable: boolean = true

	private _selected: boolean = false
	private _pva: PVA = new PVA()
	public advTexture
	private _movementInterval: NodeJS.Timer | undefined

	constructor(scene: Scene, name?: string) {
		super(name ?? "Movable", scene)

		this._pva.setFrontAcc(Movable.FRONT_ACC, Movable.FRONT_VEL_MAX)
		this._pva.setSideAcc(Movable.SIDE_ACC, Movable.SIDE_VEL_MAX)

		this.advTexture = gui.setAdvTextureToRemote(`${this.name}GUI`, this._scene)
	}

	async load() {
		const heart: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, this._scene)
		heart.parent = this

		this.position = new Vector3(0, 4, 10)
	}

	attachNametag() {
		gui.setNameTag(`${this.name} selected`, { innerText: this.name, fontSize: 10, color: "coral", offsetY: -60 }, this)
	}
	detachNametag() {
		gui.removeByName(`${this.name} selected`, this)
	}

	attachButton() {
		gui.setBtn(`${this.name} button`, { innerText: "button", w: "60px", h: "20px", color: "coral", bgcolor: "skyblue" }, this)
		gui.setFnByName(`${this.name} button`, () => { gui.removeByName(`${this.name} button`, this) }, this)
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
	focusIn() {
		this._selected = true
		this.attachMove()

		this.attachNametag()
		this.attachButton()
	}
	focusOut() {
		this._selected = false
		this.detachMove()

		this.detachNametag()
	}

	setCameraToThis(cam: ArcRotateCamera | FreeCamera) {
		cam.setTarget(this.position)
	}
}

export { Movable }