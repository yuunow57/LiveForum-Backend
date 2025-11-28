.

🔥 LiveForum — 실시간 커뮤니티 플랫폼 (NestJS + WebSocket)

실시간 댓글 · 좋아요 · 알림 · 조회수 · 통계 · 캐싱 · 인증
NestJS & WebSocket 기반 고성능 커뮤니티 서버
(1인 개발 · 백엔드 100% 기여)

🚀 프로젝트 소개

LiveForum은 실시간 WebSocket 기반의 고성능 커뮤니티 플랫폼입니다.
REST API + WebSocket 하이브리드 아키텍처를 사용하여,

댓글·좋아요·알림의 즉시 반영

Redis 기반 캐시 / Pub-Sub

JWT 인증 + Refresh Token 자동 재발급

BullMQ 기반 비동기 큐 처리

통계 API & 인기글 캐싱

실무 수준 보안 구성

등 실제 서비스에서 필요한 핵심 기능들을 모두 구현한 프로젝트입니다.

🛠 기술 스택
Backend

NestJS (DI / 모듈 아키텍처)

TypeScript

MySQL + TypeORM

Socket.IO WebSocket Gateway

Redis (cache + pub/sub)

BullMQ (Queue)

JWT + Refresh Token

Swagger

Jest (Unit / E2E Test)

Infra

Render (Backend, 예정)

Vercel (Frontend, 예정)

Railway / PlanetScale (MySQL)

Upstash Redis (Serverless Redis)

Security

Helmet

Throttler (IP Rate Limit)

ValidationPipe

CORS

WebSocket 인증 (JWT Adapter)

📂 폴더 구조 (실제 레포지토리 기반)
liveforum-backend/
 ├─ src/
 │   ├─ main.ts                     # NestJS 부트스트랩
 │   ├─ app.module.ts               # 최상위 모듈
 │   │
 │   ├─ auth/                       # 로그인, 회원가입, JWT & Refresh Token
 │   ├─ user/                       # 유저 정보
 │   ├─ board/                      # 게시판(카테고리)
 │   ├─ post/                       # 게시글 CRUD + 조회수 + 인기글 캐싱
 │   ├─ comment/                    # 댓글 CRUD + WebSocket 실시간 송출
 │   ├─ like/                       # 게시글/댓글 좋아요 통합 도메인
 │   ├─ notification/               # 알림 시스템 (Producer/Consumer)
 │   ├─ events/                     # WebSocket Gateway & JWT Adapter
 │   ├─ redis/                      # Redis 모듈(CacheModule 래핑)
 │   ├─ queue/                      # BullMQ Queue 모듈
 │   ├─ stats/                      # 통계 API (일별 게시글/댓글 수)
 │   └─ common/                     # 데코레이터/가드/인터셉터/필터 등 공통 기능
 │
 ├─ test/                           # Jest E2E 테스트
 ├─ dist/                           # 빌드 결과물
 │
 ├─ .env                            # 환경 변수 (local)
 ├─ package.json
 ├─ tsconfig.json
 ├─ tsconfig.build.json
 ├─ eslint.config.mjs
 └─ .prettierrc

✨ 주요 기능 요약
✔️ 1. 인증 / 보안 (JWT + Refresh Token)

Access Token + Refresh Token 발급

Refresh Token DB 저장 후 자동 재발급

bcrypt 비밀번호 암호화

WebSocket 연결 시에도 JWT 인증 적용

Helmet / Throttler / ValidationPipe 적용

✔️ 2. 게시글(Post) CRUD + 조회수 + 인기글 캐싱

생성 / 조회 / 수정 / 삭제

최신순 정렬

페이지네이션

조회수 증가 시 Redis 캐시 무효화

인기글 캐싱 + TTL

✔️ 3. 댓글(Comment) — WebSocket 실시간 반영

REST + WebSocket 하이브리드 구조

댓글 생성 시 해당 게시글 방(post:{id})으로 브로드캐스트

이벤트 이름: comment_added

✔️ 4. 좋아요(Likes) — 단일 테이블 구조

게시글/댓글 공용 Like 엔티티

targetType: 'post' | 'comment'

좋아요/취소 시 실시간 반영 이벤트 송출

✔️ 5. 알림(Notification)

댓글/좋아요 발생 시 자동 알림 생성

사용자 개인 방(user:{id})으로 실시간 push

읽음 처리 API 제공

✔️ 6. Redis 캐싱

게시글 캐싱 (post:{id})

인기 글 캐싱

TTL 기반 자동 만료

조회수 누적 시 캐시 삭제로 최신 유지

✔️ 7. 통계 API

일별 게시글 수

일별 댓글 수

간단한 Analytics 기능 → 관리자 페이지 확장 가능

✔️ 8. Queue (BullMQ)

알림 생성/전송 비동기 처리

이벤트 처리 분리로 서버 부담 감소

✔️ 9. 테스트 (Jest)

AuthService Unit Test

PostService Unit Test

E2E Test(app.e2e-spec.ts)

🧱 ERD (텍스트 버전)
User (1) ──── (N) Post
User (1) ──── (N) Comment
Post (1) ──── (N) Comment
Post (1) ──── (N) Like
Comment (1) ─ (N) Like
User (1) ─── (N) Notification

🧭 전체 아키텍처
REST 흐름

Auth

User

Posts

Comments

Likes

Notifications

Stats

WebSocket 흐름
Client → ws connect → JWT 인증 → events.gateway

게시글 방: post:{id}
  댓글 추가 시 해당 방으로 실시간 전송

개인 방: user:{id}
  알림 실시간 push

Redis

캐싱 계층

WebSocket pub/sub

인기글 TTL 관리

⚙️ 실행 방법
npm install
npm run start:dev

🧩 .env 예시
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=liveforum

JWT_SECRET=mysecret

REDIS_HOST=localhost
REDIS_PORT=6379

📘 API 문서 (Swagger)
/api/docs

📌 개발 진행 상황

✔ 백엔드 핵심 기능 전체 구현

✔ WebSocket 실시간 기능

✔ JWT + Refresh Token

✔ Redis 캐싱 / Pub-Sub

✔ 통계 API

✔ 보안 강화

✔ Jest 단위 테스트

⏳ 프론트엔드 개발 (Week 5–6 예정)

⏳ 배포 (프론트 완료 후 진행)

📎 라이선스

MIT License