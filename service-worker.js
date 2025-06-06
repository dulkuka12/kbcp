// service-worker.js


/*
const CACHE_NAME = "kbcp";
const CACHE_FILES = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/icon-192.png",
  "/icon-512.png"
];

// 설치 (Install) 이벤트
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시 저장 중...");
      return cache.addAll(CACHE_FILES);
    })
  );
  console.log("Service Worker 설치 완료");
});

// 활성화 (Activate) 이벤트
self.addEventListener("activate", (event) => {
  console.log("Service Worker 활성화됨");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("이전 캐시 삭제:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 요청 처리 (Fetch) 이벤트
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/

const CACHE_NAME = "kbcp-v2";
const CACHE_FILES = [
  "/kbcp/",
  "/kbcp/index.html",
  "/kbcp/style.css",
  "/kbcp/main.js",
  "/kbcp/icon-192.png",
  "/kbcp/icon-512.png",
  "/kbcp/manifest.json"
];

// 설치 이벤트: 캐시 저장 + 즉시 활성화
self.addEventListener("install", (event) => {
  console.log("📦 Service Worker 설치 및 캐시 저장 중...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();  // 새 워커 바로 적용
});

// 활성화 이벤트: 이전 캐시 제거
self.addEventListener("activate", (event) => {
  console.log("🟢 Service Worker 활성화됨");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑 이전 캐시 삭제:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 요청 이벤트: 캐시 우선, 없으면 네트워크 요청
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
