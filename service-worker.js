// service-worker.js
// 1) 캐시 이름은 앱별 프리픽스로 완전히 분리
const CACHE_PREFIX = "kbcp-";
const CACHE_VERSION = "v4.6";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

// 2) kbcp 전용 파일만 절대경로로 명시
const CACHE_FILES = [
  "/kbcp/all-proper-select.html",
  "/kbcp/anointing-sick-lesson.html",
  "/kbcp/anointing-sick.html",
  "/kbcp/baptism-lesson.html",
  "/kbcp/baptism.html",
  "/kbcp/bcp-guide.html",
  "/kbcp/blessing-artifacts-text.html",
  "/kbcp/blessing.html",
//  "/kbcp/brief-prayer.html",
  "/kbcp/burial-prayer.html",
  "/kbcp/coffin-prayer.html",
  "/kbcp/collect-list-p.html",
  "/kbcp/collect-list.html",
  "/kbcp/collect-text.html",
  "/kbcp/commandments-text.html",
  "/kbcp/commendatory-prayer.html",
  "/kbcp/compline-prayer.html",
  "/kbcp/creeds-text.html",
//  "/kbcp/cremate-prayer.html",
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
//  "/kbcp/non-believer-lesson.html",
//  "/kbcp/non-believer.html",
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
  /*"/kbcp/version.txt",버전구분을 위해 복사안함*/
  "/kbcp/vestry.html"
];


// 3) 설치: kbcp 파일만 캐시
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.error("❌ [kbcp][Install] 캐시 실패:", err);
      })
  );
});

// 4) 활성화: "kbcp-"로 시작하는 캐시만 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          // kbcp가 만든 캐시만 대상으로 하고, 최신 것만 남김
          if (k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME) {
            return caches.delete(k);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

/*
// 5) fetch: kbcp 캐시만 조회 (다른 앱 캐시와 교차탐색 금지)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // GET만 처리
  if (request.method !== "GET") return;

  // 같은 오리진 & /kbcp/ 경로만 해당 서비스워커가 응답
  const url = new URL(request.url);
  const isSameOrigin = url.origin === location.origin;
  const isKbcpPath = url.pathname.startsWith("/kbcp/");
  if (!isSameOrigin || !isKbcpPath) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached; // 캐시 우선

      // 네트워크 시도 (설치 시점에 미리 캐시된 파일 외 요청은 통과만)
      try {
        const resp = await fetch(request);
        // 필요 시 동적 캐시를 원하면 아래 주석 해제:
        // cache.put(request, resp.clone());
        return resp;
      } catch (err) {
        // 오프라인 + 캐시 없음 → 간단 폴백
        return new Response(
          "⚠️ 오프라인 상태이며 요청한 파일이 kbcp 캐시에 없습니다.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }
    })
  );
});
*/

// 5) fetch: kbcp 캐시만 조회
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // kbcp 외의 요청은 완전히 무시
  if (!url.pathname.startsWith("/kbcp/")) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const resp = await fetch(request);
        return resp;
      } catch {
        return new Response(
          "⚠️ 오프라인 상태이며 kbcp 캐시에 없습니다.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
        );
      }
    })
  );
});

