# 🔥 LiveForum — 실시간 커뮤니티 플랫폼 (NestJS + WebSocket)

> **실시간 댓글 · 좋아요 · 알림 · 조회수 · 통계 · 캐싱 · 인증**  
> NestJS & WebSocket 기반의 고성능 커뮤니티 서버  
> (1인 개발, 백엔드 100% 기여)

---

## 🚀 프로젝트 소개

**LiveForum**은 실시간 웹소켓을 기반으로 한 고성능 커뮤니티 플랫폼입니다.  
댓글·좋아요·알림이 **즉시 반영되는 빠른 사용자 경험**을 목표로 개발되었으며,

- WebSocket 실시간 기능  
- Redis 캐싱  
- JWT + Refresh Token 인증  
- BullMQ 큐 처리  
- 통계 API  
- 보안 강화(Rate Limit, Helmet, ValidationPipe)  

등 실제 서비스에서 필요한 핵심 기능을 구현한 프로젝트입니다.

---

## 🛠 기술 스택

### **Backend**
- **NestJS**
- **TypeScript**
- **MySQL + TypeORM**
- **Redis (캐싱, Pub/Sub)**
- **Socket.io (WebSocket Gateway)**
- **JWT + Refresh Token**
- **BullMQ (Queue)**
- **Jest (Unit Test)**
- **Swagger**

### **Infra**
- Render (Backend, 예정)
- Vercel (Frontend, 예정)
- Railway / PlanetScale (MySQL)
- Upstash Redis (서버리스 Redis)

### **Security**
- Helmet
- Throttler (IP Rate Limit)
- ValidationPipe
- WebSocket 인증 (JWT Adapter)
- CORS

---

## 📂 폴더 구조

```plaintext
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
```
## ✨ 주요 기능 요약

### ✔️ 1. 회원가입 / 로그인 (JWT + Refresh Token)
- Access Token + Refresh Token 발급  
- Refresh Token DB 저장  
- /auth/refresh 로 Access Token 자동 재발급  
- bcrypt 비밀번호 암호화  
- WebSocket 연결 시에도 JWT 인증 적용  


### ✔️ 2. 게시글(Post) CRUD
- 작성 / 조회 / 수정 / 삭제  
- 정렬(최신순, 인기순)  
- 페이지네이션  
- 조회수 증가 + Redis 캐시 무효화 처리  
- 인기글 캐싱  

### ✔️ 3. 댓글(Comment) 실시간 반영 (WebSocket)
- 댓글 생성 시 해당 게시글 Room에게만 실시간 송출  
- 이벤트 이름: comment_added  
- REST + WebSocket 동시에 활용하는 하이브리드 구조  

### ✔️ 4. 좋아요(Likes) — 단일 테이블 구조
- Like 테이블 하나로 게시글/댓글 좋아요 통합  
- targetType: 'post' | 'comment'  
- 좋아요/취소 시 실시간 반영 이벤트 송출  

### ✔️ 5. 알림(Notification) 시스템
- 댓글/좋아요 발생 시 알림 자동 생성  
- 사용자 개인 방(user:{id})에 push  
- 읽음 처리 API 제공  
- WebSocket 기반 실시간 알림  

### ✔️ 6. Redis 캐싱
- post:{id} 게시글 캐싱  
- 인기 글 캐싱  
- TTL 기반 자동 만료  
- viewCount 증가 시 캐시 무효화  

### ✔️ 7. 통계 API
- 일별 게시글/댓글 수  
- 활동량 증가 분석용 간단한 Analytics  
- 관리자 페이지 확장 가능 구조  

### ✔️ 8. 보안 강화
- helmet: XSS 및 웹 취약점 보호  
- throttler: IP당 60초 20회 요청 제한  
- ValidationPipe + DTO  
- CORS 제한  
- WebSocket 인증(JWT Adapter)  

### ✔️ 9. 테스트 (Jest)
- AuthService 단위 테스트  
- PostService 단위 테스트  
- Mock Repository 기반 서비스 로직 검증  

### 🧱 ERD (텍스트 버전)
```
User (1) ──── (N) Post  
User (1) ──── (N) Comment  
Post (1) ──── (N) Comment  
Post (1) ──── (N) Like  
Comment (1) ─ (N) Like  
User (1) ─── (N) Notification  
```

## 🧭 전체 아키텍처 (REST + WebSocket + Redis)

### REST 흐름
```
Auth / User  
Posts  
Comments  
Likes  
Notifications  
Stats  
```

### WebSocket 흐름
```
Client → ws connect → JWT 인증 → events.gateway

게시글 방: post:{id}  
    → 댓글 추가 시 실시간 전송

개인 방: user:{id}  
    → 알림 실시간 push  
```

### Redis  
캐싱 계층  

WebSocket pub/sub

인기글 TTL 관리

### ⚙️ 실행 방법
```
npm install  
npm run start:dev  
```

### .env 예시
```
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=1234  
DB_NAME=liveforum  
JWT_SECRET=mysecret  
REDIS_HOST=localhost  
REDIS_PORT=6379  
```

### 📘 API 문서
Swagger URL  
/api/docs  

### 📌 개발 진행 상황
- 백엔드 핵심 기능 구현

- WebSocket 실시간 기능

- JWT + Refresh Token

- Redis 캐싱

- 통계 API

- 보안 강화

- Jest 단위 테스트

- 프론트엔드 작업 (Week 5–6)

- 배포 (프론트 완료 후 진행)

### 📎 라이선스
- MIT License