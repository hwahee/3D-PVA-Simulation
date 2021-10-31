import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

class Ground {
	private _scene: Scene

	constructor(scene: Scene) {
		this._scene = scene
	}

	public async load() {
		const ground = MeshBuilder.CreateBox("ground", { size: 64 }, this._scene)
		const groundMaterial = new StandardMaterial("grass", this._scene)
		groundMaterial.diffuseTexture = new Texture("/images/grass.png", this._scene)
		ground.material = groundMaterial

		ground.scaling = new Vector3(1, 0.02, 1)
	}
}

export { Ground }