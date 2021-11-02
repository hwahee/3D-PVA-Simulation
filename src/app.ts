import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Button } from "@babylonjs/gui"
import { ArcRotateCamera, Camera, Color3, Color4, Engine, FreeCamera, HemisphericLight, Light, Matrix, Mesh, MeshBuilder, PointLight, Quaternion, Scene, SceneLoader, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Ground } from "./objects/Ground";
import { Player } from "./objects/Player"
import { mouse } from "./system/Mouse";
import { Movable } from "./objects/Object";
import { Chair } from "./objects/Chair";

const setBtn = (b: Button, op: { w?: number | string, h?: number | string, color?: string, top?: string, left?: string, thick?: number, vAlign?: number, hAlign?: number }): void => {
	b.width = op.w ?? b.width,
		b.height = op.h ?? b.height,
		b.color = op.color ?? b.color,
		b.top = op.top ?? b.top,
		b.left = op.left ?? b.left,
		b.thickness = op.thick ?? b.thickness,
		b.verticalAlignment = op.vAlign ?? b.verticalAlignment
	b.horizontalAlignment = op.hAlign ?? b.horizontalAlignment
}

class App {
	private _canvas: HTMLCanvasElement
	private _engine: Engine
	private _scene: Scene
	private _camera: ArcRotateCamera

	private _ground: Ground
	private _light: Light
	private _player: Player
	private _objects:Movable[]=[]

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

		this._player = new Player(this._scene)
		this._player.load()
		this._player.setCameraToThis(this._camera)

		this._objects.push(new Chair(this._scene))
		this._objects.forEach((i)=>{i.load()})


		
		//cam to mouse raycasting testing
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
