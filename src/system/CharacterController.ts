import { ArcRotateCamera, Camera, HemisphericLight, Mesh, MeshBuilder, Scene, ShadowGenerator, TransformNode, UniformBuffer, UniversalCamera, Vector3 } from "@babylonjs/core";

class Player extends TransformNode {
	static ORIGINAL_TILT = Vector3.Zero()
	static PLAYER_SPEED: number = 2

	private _camRoot: TransformNode | undefined
	public camera: UniversalCamera | undefined
	private _yTilt: TransformNode | undefined

	public scene: Scene
	private _input: any

	public mesh: Mesh
	private _deltaTime: number = 0
	private _moveDirection: Vector3 = Vector3.Zero()
	private _h: any;
	private _v: any;
	tutorial_move: boolean = false
	private _inputAmt: number = 0

	constructor(assets: any, scene: Scene, shadowGen: ShadowGenerator, input?: any) {
		super("player", scene)
		this.scene = scene
		this._setupPlayerCamera()

		this.mesh = assets.mesh
		this.mesh.parent = this

		shadowGen.addShadowCaster(assets.mesh)

		this._input = input
	}
	private _setupPlayerCamera() {
		this._camRoot = new TransformNode("root")
		this._camRoot.position = new Vector3(0, 0, 0)
		this._camRoot.rotation = new Vector3(0, Math.PI, 0)

		let yTilt = new TransformNode("ytilt")
		yTilt.rotation = Player.ORIGINAL_TILT
		this._yTilt = yTilt
		yTilt.parent = this._camRoot

		this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene)
		this.camera.lockedTarget = this._camRoot.position

		this.camera.fov = 0.47
		this.camera.parent = yTilt

		this.scene.activeCamera = this.camera

		return this.camera
	}

	private _updateFromControls(): void {
		this._deltaTime = this.scene.getEngine().getDeltaTime()

		this._moveDirection = Vector3.Zero()
		this._h = this._input.horizontal
		this._v = this._input.vertical

		if ((this._h != 0 || this._v != 0) && !this.tutorial_move) {
			this.tutorial_move = true
		}

		//카메라 기반 움직임
		let correctedV = this._camRoot?.forward.scaleInPlace(this._v)
		let correctedH = this._camRoot?.right.scaleInPlace(this._h)

		let move = correctedH?.addInPlace(correctedV!)

		this._moveDirection = new Vector3((move)?.normalize().x, 0, (move)?.normalize().z)

		let inputMag = Math.abs(this._h) + Math.abs(this._v)
		if (1 < inputMag) {
			this._inputAmt = 1
		}
		else {
			this._inputAmt = inputMag
		}

		this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * Player.PLAYER_SPEED)
	}
	private _beforeRenderUpdate(): void {
		this._updateFromControls()
		this.mesh.moveWithCollisions(this._moveDirection)
	}
	private _updateCamera(): void {
		let centerPlayer = this.mesh.position.y + 2
		this._camRoot!.position = Vector3.Lerp(this._camRoot!.position, new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z), 0.4)
	}

	public activatePlayerCamera(): UniversalCamera {
		this.scene.registerAfterRender(() => {
			this._beforeRenderUpdate()
			this._updateCamera()
		})
		return this.camera as UniversalCamera
	}

	
}

export { Player }