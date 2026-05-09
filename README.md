# 쌤쥐 어드벤처

`agent-sprite-forge` 워크플로를 사용해 생성/후처리한 스프라이트로 만든 브라우저 캔버스 플랫폼 게임입니다.

## 실행

```bash
cd "/Users/im_1699/Documents/New project/outputs/saengjwi_adventure_20260508"
python3 -m http.server 4173
```

브라우저에서 `http://127.0.0.1:4173`을 열면 됩니다.

## 조작

- 이동: 방향키 또는 A/D
- 점프: Space, W, 또는 위쪽 방향키
- 시작/재시작: 시작 버튼 또는 Space

## 주요 산출물

- `assets/sprites/mouse-run/`: 쌤쥐 달리기 6프레임 투명 스프라이트
- `assets/sprites/mouse-jump/`: 쌤쥐 점프 4프레임 투명 스프라이트
- `assets/sprites/sprout-turtle/`: 적 캐릭터 4프레임 투명 스프라이트
- `assets/props/`: 코인, 별, 당근, 블록, 표지판, 깃발, 치즈, 타이머, 플랫폼 조각
- `assets/sound/`: 배경음악, 점프, 코인 획득, 치즈 획득, 낙사/피격, 악당 밟기, 버튼 클릭, 게임 오버 효과음
- `data/level.json`: 플랫폼, 수집품, 적, 목표 지점, 충돌 데이터
- `vendor/agent-sprite-forge/`: 사용한 원본 레포와 후처리 스크립트
