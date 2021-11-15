import { Vector3 } from "@babylonjs/core";

/**
 * position, velocity, acceleration 개념을 이용한 이동 설계
 * 물체의 이동에 있어서 방향키를 눌렀을 때 둔순히 속도를 몇으로 설정한다에서 한 차원 높여
 * 미리 설정해 둔 가속도와 최대 속도를 바탕으로 
 */
class Movement {
	public vel: Vector3 = Vector3.Zero()
	public vel_max: Vector3 = Vector3.Zero()
	constructor() { }
	/**
	 * 앞뒤로 움직이는 속도를 설정한다. 
	 * 최대치가 주어지지 않을 경우 최대와 최소의 절댓값이 같도록 설정한다.
	 */
	setVel(vel: Vector3) {
		this.vel_max = vel
	}
	moveFront(move: number) {
		if (move == 1) {
			this.vel.z = this.vel_max.z
		}
		else if (move == -1) {
			this.vel.z = -this.vel_max.z
		}
		else {
			this.vel.z = 0
		}
	}
	moveSide(move: number) {
		if (move == 1) {
			this.vel.x = this.vel_max.x
		}
		else if (move == -1) {
			this.vel.x = -this.vel_max.x
		}
		else {
			this.vel.x = 0
		}
	}
	/**
	 * 앞뒤와 좌우 속도가 향하는 방향으로 
	 * 두 속도 중 큰 값을 속도로 하는 벡터를 반환한다.
	 */
	getNormalizedVel(): Vector3 {
		const speed = (Math.abs(this.vel.x) > Math.abs(this.vel.z)) ? this.vel.x : this.vel.z
		return new Vector3(this.vel.x, this.vel.y, this.vel.z).normalize().scale(Math.abs(speed))
	}
}
class PVA extends Movement {
	public vel_min: Vector3 = Vector3.Zero()
	public acc: Vector3 = Vector3.Zero()
	/**
	 * 앞뒤로 움직이는 속도를 설정한다. 
	 * 최대치가 주어지지 않을 경우 최대와 최소의 절댓값이 같도록 설정한다.
	 */
	setFrontAcc(incr: number, min: number, max?: number) {
		if (max === undefined) {
			max = Math.abs(min)
			min = -max
		}

		this.acc.z = incr
		this.vel_max.z = max
		this.vel_min.z = min
	}
	moveFront(move: number) {
		if (move == 1) {
			if (this.vel_min.z < this.vel.z && this.vel.z < this.vel_max.z) {
				this.vel.z += this.acc.z
			}
		}
		else if (move == -1) {
			if (this.vel_min.z < this.vel.z && this.vel.z < this.vel_max.z) {
				this.vel.z -= this.acc.z
			}
		}
		else {
			if (this.vel.z < 0) {
				this.vel.z += this.acc.z / 2
				if (Math.abs(this.vel.z) < this.acc.z * 2) {
					this.vel.z = 0
				}
			}
			else if (0 < this.vel.z) {
				this.vel.z -= this.acc.z / 2
				if (Math.abs(this.vel.z) < this.acc.z * 2) {
					this.vel.z = 0
				}
			}
		}
	}
	/**
	 * 왼쪽과 오른쪽 이동의 속도 차이가 발생하는 경우는 거의 없으므로 
	 * 항상 동일한 최대속도로 좌우 이동을 하도록 한다
	 */
	setSideAcc(incr: number, offset: number) {
		this.acc.x = incr
		this.vel_max.x = offset
		this.vel_min.x = -offset
	}
	moveSide(move: number) {
		if (move == 1) {
			if (this.vel_min.x < this.vel.x && this.vel.x < this.vel_max.x) {
				this.vel.x += this.acc.x
			}
		}
		else if (move == -1) {
			if (this.vel_min.x < this.vel.x && this.vel.x < this.vel_max.x) {
				this.vel.x -= this.acc.x
			}
		}
		else {
			if (this.vel.x < 0) {
				this.vel.x += this.acc.x / 2
				if (Math.abs(this.vel.x) < this.acc.x * 2) {
					this.vel.x = 0
				}
			}
			else if (0 < this.vel.x) {
				this.vel.x -= this.acc.x / 2
				if (Math.abs(this.vel.x) < this.acc.x * 2) {
					this.vel.x = 0
				}
			}
		}
	}
	/**
	 * 앞뒤와 좌우 속도가 향하는 방향으로 
	 * 두 속도 중 큰 값을 속도로 하는 벡터를 반환한다.
	 */
	setVelArbitrary(vel: Vector3) {
		this.vel = vel
	}

	/**
	 * 속도 초기화
	 */
	reset() {
		this.vel = Vector3.Zero()
	}
}

export { Movement, PVA }