# 3D-PVA-Simulation
3D 공간 상에서 위치, 속도, 가속도를 사용한 물체의 움직임 구현

![PVA-simulation](https://user-images.githubusercontent.com/44242823/139566023-2b6199bf-e587-4f98-8397-701b3ec66086.png)

## 사용 기술
- babylon

## 발생 문제
- 문제: w키만 누르는 것보다 wd, wa를 같이 누르는게 빠르다
	- 원인: normalize와 scale(speed)를 해야 하는데 speed를 제대로 구하지 못했다
	- 해결: speed를 velX와 velZ 중 절대값이 더 큰 것으로 설정, normalize한 다음 abs(speed)로 scale함