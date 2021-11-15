import { ArcRotateCamera, FreeCamera, Mesh, AbstractMesh, MeshBuilder, Scene, SceneLoader, TransformNode, Vector3, AnimationGroup } from "@babylonjs/core";
import { gui } from "../gui/GUI";
import { keyboard } from "../system/Keyboard";
import { Movement, PVA } from "../engine/Movement";
import { focusMng } from "../system/FocusManager";

class Movable extends TransformNode {
	static VEL: Vector3 = new Vector3(1, 1, 1)
	static FRONT_ACC: number = 0.01
	static FRONT_VEL_MAX: number = 1
	static SIDE_ACC: number = 0.01
	static SIDE_VEL_MAX: number = 0.5
	static RoG: number = 2 * Math.PI / 180
	readonly isSelectable: boolean = true

	private _selected: boolean = false
	private _movement: Movement | PVA | undefined
	public advTexture
	private _movementInterval: NodeJS.Timer | undefined

	constructor(scene: Scene, name?: string) {
		super(name ?? "Movable", scene)

		this.advTexture = gui.setAdvTextureToRemote(`${this.name}GUI`, this._scene)
	}

	async load() {
		const heart: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, this._scene)
		heart.parent = this

		this.position = new Vector3(0, 0, 0)
	}
	public setMovement(type: string, op: { vel?: Vector3, front_acc?: number, front_vel_max?: number, side_acc?: number, side_vel_max?: number }) {
		if (type === "PVA") {
			this._movement = new PVA();
			(<PVA>this._movement).setFrontAcc(op.front_acc ?? Movable.FRONT_ACC, op.front_vel_max ?? Movable.FRONT_VEL_MAX);
			(<PVA>this._movement).setSideAcc(op.side_acc ?? Movable.SIDE_ACC, op.side_vel_max ?? Movable.SIDE_VEL_MAX)
		}
		else {
			this._movement = new Movement()
			this._movement.setVel(op.vel ?? new Vector3(Movable.VEL.x, Movable.VEL.y, Movable.VEL.z))
		}
	}

	private _attachNametag() {
		gui.setNameTag(`${this.name} selected`, { innerText: this.name, fontSize: 10, color: "coral", offsetY: -60 }, this)
	}
	private _detachNametag() {
		gui.removeByName(`${this.name} selected`, this)
	}

	private _attachButton() {
		let offsetY = 0
		const getOffsetY = () => { offsetY += 20; return offsetY - 20 }
		const getOP = (innerText?: string) => ({ innerText: innerText ?? "button", w: "60px", h: "20px", color: "coral", bgcolor: "skyblue", offsetY: getOffsetY() })

		const btnClose: string = `${this.name} INTERFACE close`
		gui.setBtn(btnClose, getOP("close"), this)
		gui.setFnByName(btnClose, () => { this.closeInterface() }, this)

		const btnDummy: string = `${this.name} INTERFACE dummy`
		gui.setBtn(btnDummy, getOP("dummy"), this)
		gui.setFnByName(btnDummy, () => { console.log("dummy hello") }, this)

		const btnFunnymove: string = `${this.name} INTERFACE funnymove`
		gui.setBtn(btnFunnymove, getOP("funnymove"), this)
		gui.setFnByName(btnFunnymove, () => {
			if (this._selected) {
				if (this._movement && this._movement["setVelArbitrary"]) {
					(<PVA>this._movement).setVelArbitrary(new Vector3(0, 0, -2))
				}
			}
		}, this)
	}
	private _detachButton() {
		gui.removeByName((i) => (i.name.includes("INTERFACE")), this)
	}

	private _attachMove() {
		if (!this._movement) return

		this._movementInterval = setInterval(() => {
			const keystat = keyboard.getKeyStatus()

			const dYaw = ((keystat.q ? -1 : 0) + (keystat.e ? 1 : 0)) * Movable.RoG
			this.rotation.set(this.rotation.x, this.rotation.y + dYaw, this.rotation.z)

			this._movement?.moveFront((keystat.w ? -1 : 0) + (keystat.s ? 1 : 0))
			this._movement?.moveSide((keystat.d ? -1 : 0) + (keystat.a ? 1 : 0))

			let out_vel: Vector3 = Vector3.Zero()
			this._movement?.getNormalizedVel().rotateByQuaternionToRef(this.rotation.toQuaternion(), out_vel)

			this.position.addToRef(out_vel, this.position)
		}, 40)
	}
	private _detachMove() {
		if (this._movementInterval) {
			clearInterval(this._movementInterval)
		}
		if (this._movement && this._movement["reset"]) {
			(<PVA>this._movement).reset()
		}
	}

	/**
	 * 포커스 인 되었을 때 가능해지는 기능들을 설정한다.
	 */
	focusIn() {
		this._selected = true
		this._attachMove()

		this._attachNametag()
	}
	focusOut() {
		this._selected = false
		this._detachMove()

		this._detachNametag()
	}

	openInterface() {
		this._attachButton()
	}
	closeInterface() {
		this._detachButton()
	}

	setCameraToThis(cam: ArcRotateCamera | FreeCamera) {
		cam.setTarget(this.position)
	}
}

class GLBModel extends Movable {
	private _modelUrl: string = ""
	private _model: AbstractMesh | undefined
	private _animGroup: AnimationGroup[] = []
	constructor(scene: Scene, name?: string) {
		super(scene, name ?? "GLBModel")
	}
	setModel(url: string) {
		this._modelUrl = url
	}

	async load() {
		//super.load()

		await SceneLoader.ImportMeshAsync(undefined, "", this._modelUrl, this._scene)
			.then((res) => {
				console.log(res)
				this._model = res.meshes[0]
				this._animGroup = res.animationGroups

				if (this._model !== undefined) {
					this._model.parent = this
					this._model.scaling = new Vector3(2, 2, 2)
					this._animGroup[0]?.pause()
				}
			})
	}
}
export { Movable, GLBModel }