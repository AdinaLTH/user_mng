// ==========================================
// 1. 필요한 모듈 불러오기
// ==========================================
// 파일 경로를 쉽게 다루기 위해 Node.js에 내장된 모듈들을 가져옵니다.
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

// Vite 설정 함수와 Vue 관련 플러그인들을 가져옵니다.
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  // ==========================================
  // 2. 플러그인 설정
  // ==========================================
  // Vite가 Vue 파일(.vue)을 이해할 수 있도록 플러그인을 장착합니다.
  // vueDevTools는 브라우저(크롬 등)에서 Vue 상태를 쉽게 디버깅할 수 있게 도와줍니다.
  plugins: [vue(), vueDevTools()],

  // ==========================================
  // 3. 경로 별칭 (Alias) 설정
  // ==========================================
  // 왜 필요한가? 폴더 구조가 깊어지면 파일을 불러올 때
  // import UserList from '../../../../components/UserList.vue' 처럼 코드가 지저분해집니다.
  // 이 설정을 해두면 '@' 기호가 무조건 'src' 폴더를 가리키게 되어,
  // import UserList from '@/components/UserList.vue' 로 아주 깔끔하게 쓸 수 있습니다.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // ==========================================
  // 4. 개발 서버 및 프록시(Proxy) 설정 (★가장 중요★)
  // ==========================================
  // 여기가 바로 프론트엔드(Vue)와 백엔드(Node.js)를 연결해 주는 비밀 통로입니다!
  server: {
    proxy: {
      // 규칙: Vue 프론트엔드에서 API 요청을 보낼 때 '/api'로 시작하는 주소로 보내면...
      "^/api": {
        // 1. 목적지 변경 (Target)
        // 우리가 뚫어놓은 백엔드 서버 주소(app.js의 3000번 포트)로 몰래 요청을 대신 보내줍니다!
        // (참고로 Vue 기본 개발 서버는 보통 5173번 포트를 씁니다.)
        target: `http://localhost:3000`,

        // 2. 출처 변경 (CORS 에러 방지)
        // 브라우저는 포트 번호가 다르면(5173 -> 3000) 해킹으로 의심하고 차단해 버립니다(CORS 에러).
        // changeOrigin: true로 설정하면, 프론트 서버가 백엔드 서버인 척 위장해서 이 에러를 막아줍니다.
        changeOrigin: true,

        // 3. 경로 재작성 (Rewrite)
        // 프론트에서는 "구분하기 위해" 주소에 '/api'를 붙였지만 (예: /api/users),
        // 백엔드 라우터에는 '/api'라는 길이 없고 '/users'만 있습니다.
        // 그래서 백엔드로 요청이 넘어가기 직전에 '/api' 글자만 살짝 지워주는 마법의 정규식입니다.
        // 결과: 프론트 요청(/api/users) -> 프록시 변환 -> 백엔드 도착(/users)
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
