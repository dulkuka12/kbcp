// service-worker.js

const CACHE_NAME = "kbcp-v4.5";
const CACHE_FILES = [
  "/kbcp/all-proper-select.html",
  "/kbcp/anointing-sick-lesson.html",
  "/kbcp/anointing-sick.html",
  "/kbcp/baptism-lesson.html",
  "/kbcp/baptism.html",
  "/kbcp/bcp-guide.html",
  "/kbcp/blessing-artifacts-text.html",
  "/kbcp/blessing.html",
  "/kbcp/brief-prayer.html",
  "/kbcp/burial-prayer.html",
  "/kbcp/coffin-prayer.html",
  "/kbcp/collect-list-p.html",
  "/kbcp/collect-list.html",
  "/kbcp/collect-text.html",
  "/kbcp/commandments-text.html",
  "/kbcp/commendatory-prayer.html",
  "/kbcp/compline-prayer.html",
  "/kbcp/creeds-text.html",
  "/kbcp/cremate-prayer.html",
  "/kbcp/daily-office-select.html",
  "/kbcp/departure-prayer.html",
  "/kbcp/enshrining-prayer.html",
  "/kbcp/evening-prayer.html",
  "/kbcp/funeral-select.html",
  "/kbcp/great-litany-text.html",
  "/kbcp/holyday-select.html",
  "/kbcp/holyday-text.html",
  "/kbcp/icon-192.png",
  "/kbcp/icon-512.png",
  "/kbcp/index.html",
  "/kbcp/install-guide.html",
  "/kbcp/lesson1-list-p.html",
  "/kbcp/lesson1-list.html",
  "/kbcp/lesson1-text.html",
  "/kbcp/lesson2-list-p.html",
  "/kbcp/lesson2-list.html",
  "/kbcp/lesson2-text.html",
  "/kbcp/litanies-select-p.html",
  "/kbcp/litanies-select.html",
  "/kbcp/litanies-text.html",
  "/kbcp/main-prayer-select.html",
  "/kbcp/main-prayer-text.html",
  "/kbcp/main.js",
  "/kbcp/manifest.json",
  "/kbcp/maternity.html",
  "/kbcp/memorial-prayer-lesson.html",
  "/kbcp/memorial-prayer.html",
  "/kbcp/morning-prayer.html",
  "/kbcp/non-believer-lesson.html",
  "/kbcp/non-believer.html",
  "/kbcp/noonday-prayer.html",
  "/kbcp/outline-list.html",
  "/kbcp/outline-text.html",
  "/kbcp/pastoral-select.html",
  "/kbcp/prayer-for-dead-lesson.html",
  "/kbcp/prayer-for-dead.html",
  "/kbcp/prayer-select-p.html",
  "/kbcp/prayer-select.html",
  "/kbcp/prayer-text.html",
  "/kbcp/proper-guide.html",
  "/kbcp/proper-list-p.html",
  "/kbcp/proper-list.html",
  "/kbcp/proper-text.html",
  "/kbcp/psalm-guide.html",
  "/kbcp/psalm-list1-p.html",
  "/kbcp/psalm-list1.html",
  "/kbcp/psalm-list2-p.html",
  "/kbcp/psalm-list2.html",
  "/kbcp/psalm-select-p.html",
  "/kbcp/psalm-select.html",
  "/kbcp/psalm-text.html",
  "/kbcp/reception.html",
  "/kbcp/reconciliation.html",
  "/kbcp/sacrament-select.html",
  "/kbcp/service-worker.js",
  "/kbcp/splash.html",
  "/kbcp/style.css",
  "/kbcp/ucharist-form1.html",
  "/kbcp/ucharist-form2.html",
  "/kbcp/ucharist-select.html",
  "/kbcp/user-guide.html",
  "/kbcp/version.txt",
  "/kbcp/vestry.html"
];


// 설치 이벤트: 캐시 저장 성공 시에만 완료
self.addEventListener("install", (event) => {
  console.log("📦 [Install] 캐시 저장 시작...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES);
    }).then(() => {
      console.log("✅ [Install] 캐시 저장 완료");
      self.skipWaiting(); // 바로 적용
    }).catch((err) => {
      console.error("❌ [Install] 캐시 저장 실패:", err);
      // 설치 실패 시 activate가 실행되지 않음 → 기존 캐시 유지됨
    })
  );
});

// 활성화 이벤트: 이전 캐시 제거 (단, 현재 캐시가 준비된 경우에만)
self.addEventListener("activate", (event) => {
  console.log("🟢 [Activate] Service Worker 활성화됨");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑 [Activate] 이전 캐시 삭제:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 요청 이벤트: 캐시 우선, 없으면 네트워크 → 실패 시 fallback 또는 에러 방지
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // 캐시 우선 응답
      }
      return fetch(event.request).catch((err) => {
        console.warn("⚠️ [Fetch] 네트워크 실패, 캐시도 없음:", event.request.url);
        // fallback.html이 있다면 여기에 넣을 수 있습니다.
        return new Response("⚠️ 오프라인 상태이며 요청한 파일이 캐시에 없습니다.", {
          status: 503,
          statusText: "Offline fallback",
          headers: { "Content-Type": "text/plain" }
        });
      });
    })
  );
});

