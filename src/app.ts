import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as GUI from "@babylonjs/gui"
import { ArcRotateCamera, Camera, Color3, Color4, CubeMapInfo, Engine, FreeCamera, HemisphericLight, Light, Matrix, Mesh, MeshBuilder, PointLight, Quaternion, Scene, SceneLoader, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Ground } from "./objects/Ground";
import { Player } from "./objects/Player"
import { mouse } from "./system/Mouse";
import { GLBModel, Movable } from "./objects/Object";
import { Chair } from "./objects/Chair";
import { gui } from "./gui/GUI";

class App {
	private _canvas: HTMLCanvasElement
	private _engine: Engine
	private _scene: Scene
	private _camera: ArcRotateCamera
	private _advTexture: GUI.AdvancedDynamicTexture

	private _ground: Ground
	private _light: Light
	private _player: Player
	private _objects: Movable[] = []

	constructor() {
		// create the canvas html element and attach it to the webpage
		this._canvas = document.createElement("canvas") as HTMLCanvasElement
		this._canvas.style.width = "100%"
		this._canvas.style.height = "100%"
		this._canvas.id = "gameCanvas"
		document.body.appendChild(this._canvas)

		// initialize babylon scene and engine
		this._engine = new Engine(this._canvas, true)
		this._scene = new Scene(this._engine)

		this._camera = new ArcRotateCamera("Camera", Math.PI / 2 * 2.25, Math.PI / 2 * 0.75, 16, new Vector3(0, 2, 0), this._scene)
		this._camera.attachControl(this._canvas, true)

		this._light = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene)

		this._ground = new Ground(this._scene)
		this._ground.load()

		let lodestone: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene)
		lodestone.position = new Vector3(0, 2, 0)

		this._advTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

		this._player = new Player(this._scene)
		this._player.setMovement("PVA", {})
		this._player.load()
		this._player.setCameraToThis(this._camera)

		this._objects.push(new Chair(this._scene));
		(this._objects[0] as Chair).setMovement("default", {})
		this._objects.push(new GLBModel(this._scene));
		(this._objects[1] as GLBModel).setModel("https://raw.githubusercontent.com/hwahee/myResource/main/hiphopdancing.glb")
		this._objects.forEach((i) => { i.load() })

		//cam to mouse raycasting
		mouse.init(this._canvas, this._scene)

		// hide/show the Inspector
		window.addEventListener("keydown", (e) => {
			// Shift+Ctrl+Alt+I
			if (e.shiftKey && e.ctrlKey && e.altKey && e.key == "I") {
				if (this._scene.debugLayer.isVisible()) {
					this._scene.debugLayer.hide()
				} else {
					this._scene.debugLayer.show()
				}
			}
		})
	}

	public run() {
		this._engine.runRenderLoop(() => {
			this._scene.render()
		})
	}
}

const app: App = new App()
app.run()
