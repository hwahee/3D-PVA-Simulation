# 3D-PVA-Simulation
3D 공간 상에서 위치, 속도, 가속도를 사용한 물체의 움직임 구현

![PVA-simulation](https://user-images.githubusercontent.com/44242823/139566023-2b6199bf-e587-4f98-8397-701b3ec66086.png)

## 사용 기술
- babylon

## 빌드 및 실행

## 목표
- 애니메이션 직접 정의하고 구현하기
- glb 파일 사용하기
- 상호작용 추가하기

## 진행 상황
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