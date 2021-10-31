import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

class Ground {
	private _scene: Scene

	constructor(scene: Scene) {
		this._scene = scene
	}

	public async load() {
		const ground = MeshBuilder.CreateBox("ground", { size: 256 }, this._scene)
		const groundMaterial = new StandardMaterial("grass", this._scene)
		groundMaterial.diffuseTexture = new Texture("/images/grass.png", this._scene)
		ground.material = groundMaterial

		ground.scaling = new Vector3(1, 0.002, 1)
	}
}

export { Ground }