# 3D-Movement-Simulation
3D 공간 상에서 물체의 움직임 구현

![PVA-simulation](https://user-images.githubusercontent.com/44242823/139566023-2b6199bf-e587-4f98-8397-701b3ec66086.png)

## 사용 기술
- babylon
- webpack

## 빌드 및 실행
	npm install 
	npm run build
	npm start
	브라우저로 localhost:3000 접속

## 용어 설명
	- Vector3: x,y,z의 벡터 표현, P, V, A를 모두 이를 사용하여 표현함 
	- 좌표계: 3차원 데카르트 좌표계 사용, Vector3으로 표현,  
	
	- P(Position): 오브젝트의 현재 위치를 3차원 데카르트 좌표계 상에서 표기한 것
	- V(Velocity): 오브젝트의 현재 xyz 방향별 속도
	- A(Acceleration): PVA의 움직임을 따르는 오브젝트가 1프레임 당 얻는 가속도
	
	- PV: 일반적인 3D 게임에서의 움직임
	- PV-free: 중력에 구애받지 않는 PV 움직임 (ex: 마인크래프트의 크리에이티브 모드)
	- PVA: PV에 가속도를 더하여 방향키로 각 방향별 가속도를 조절하여 움직이는 움직임 (ex: 레이싱 게임에서의 자동차)

## 진행 
### #9 201119
	- PV_free 추가, space, ctrl을 이용한 상하 이동 구현
### #8 211115
	- 기본 이동(PV) 추가한 다음 PVA를 서브클래스로 두기
### #7 211106
	- glb 모델 위치 변화 없는 문제 해결
### #6 211105
	- 인터페이스 버튼 구성 모듈화
	- focusManager가 사용되지 않았던 문제 해결
	- glb 모델 기초
### #5 211104
	- 글로벌 GUI가 관리하는 개별 GUI 생성
	- 오브젝트가 선택되었을 때 따라다니는 이름표가 나타나도록 설정
	- 클릭 시 버튼 인터페이스가 나타나는 기초 완성 
### #4 211103
	- GUI를 위한 모듈 제작, 버튼 테스트
### #3 211102
	- 마우스 클래스 제작
	- 카메라 - 마우스 레이캐스팅으로 오브젝트 선택 기능 추가
### #2 211031
	- 대각선 이동 시 속도 1.414배 문제 해결
### #1 211030
	- 프로젝트 생성
	- 키보드로 이동하는 플레이어 생성
	- PVA 개념을 이용하여 움직임 시뮬레이션

## 발생 문제
- 문제: w키만 누르는 것보다 wd, wa를 같이 누르는게 빠르다
	- 원인: normalize와 scale(speed)를 해야 하는데 speed를 제대로 구하지 못했다
	- 해결: speed를 velX와 velZ 중 절대값이 더 큰 것으로 설정, normalize한 다음 abs(speed)로 scale함

- 문제: cavnas의 이벤트 핸들러 중 click은 작동되지만 mousedown, mouseup은 작동하지 않음
	- 해결: mousedown 대신 pointerdown을 사용함 

- 문제: glb모델의 눈에 보이는 실체가 실제 위치를 따라가지 않음
	- 해결: ImportMeshAsync로 나온 결과물 res의 mesh 중 인덱스 0번을 소용해야 했음