// service-worker.js

const CACHE_NAME = "kbcp-v1";
const CACHE_FILES = [
  "/",
  "/index.html",
  "/style.css",
  "/icon-192.png",
  "/icon-512.png",
  "/daily-office.html"
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
