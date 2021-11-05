import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

class Ground {
	private _scene: Scene

	constructor(scene: Scene) {
		this._scene = scene
	}

	public async load() {
		const ground = MeshBuilder.CreateGround("ground", { width: 256, height:256 }, this._scene)
		const groundMaterial = new StandardMaterial("grass", this._scene)
		groundMaterial.diffuseTexture = new Texture("/images/grass.png", this._scene)
		ground.material = groundMaterial

		ground.scaling = new Vector3(1, 1, 1)
	}
}

export { Ground }