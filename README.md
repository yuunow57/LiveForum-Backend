# 🧱 LiveForum - 실시간 커뮤니티 서버

> NestJS + TypeScript + MySQL + WebSocket 기반 백엔드 포트폴리오 프로젝트  
> 1주차 목표: 인증 시스템 + 전역 설정 + Swagger 완성

---

## ⚙️ Tech Stack

| 구분 | 기술 |
|:--|:--|
| Language | TypeScript |
| Framework | NestJS |
| Database | MySQL (TypeORM) |
| Auth | JWT + bcrypt |
| Real-time | WebSocket (Socket.io Gateway 예정) |
| Docs | Swagger `/api/docs` |
| Deployment | Render / Railway (예정) |

---

## 📁 Folder Structure

src/  
├─ common/  
├─ auth/  
├─ user/  
└─ main.ts  


---

## 🚀 실행 방법

```bash
# 1️⃣ 설치
npm install

# 2️⃣ 환경 변수 설정 (.env)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=mysql123
DB_DATABASE=liveforum
JWT_SECRET=my_secret_key
PORT=3000

# 3️⃣ 실행
npm run start:dev

# 4️⃣ Swagger 확인
http://localhost:3000/api/docs

🧩 Features

✅ 회원가입 / 로그인 / JWT 인증

✅ ValidationPipe / Interceptor / Filter 전역 적용

✅ Swagger 자동 문서화

🔜 게시판 / 게시글 / 댓글 / 좋아요

🔜 WebSocket 실시간 알림
