
// 공통: DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function () {

  // 텍스트 선택 방지
  document.body.addEventListener('selectstart', function (e) {
    e.preventDefault();
  });

  // 우클릭(롱터치 포함) 방지
  document.body.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // 드래그 시작 방지
  document.body.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  // 모바일 롱터치 방지
  document.body.addEventListener('touchstart', function (e) {
    const tag = e.target.tagName.toLowerCase();
    const target = e.target;

    // 이미지 롱터치 방지
    if (tag === 'img') {
      e.preventDefault();
    }

    // 다운로드 링크 롱터치 방지
    if (tag === 'a' && target.hasAttribute('download')) {
      e.preventDefault();
    }

    // 두 손가락 이상 터치 방지 (멀티터치 차단)
    if (e.touches.length > 1) {
      e.preventDefault();
    }

  }, { passive: false });

});



function rememberClosest(idPrefix, storageKey, fileName) {
  const headings = document.querySelectorAll(`div.subtitle[id^="${idPrefix}"]`);
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const offsetMargin = 60; // 상단바 높이
  let closest = null;
  let closestDistance = Infinity;

  headings.forEach(heading => {
    const headingTop = heading.getBoundingClientRect().top;
    const isVisible = headingTop >= offsetMargin && headingTop <= viewportHeight - offsetMargin;

    if (isVisible) {
      const distance = Math.abs(headingTop - offsetMargin);
      if (distance < closestDistance) {
        closest = heading;
        closestDistance = distance;
      }
    }
  });

  if (closest) {
    // ✅ 제목이 보이는 경우 정상 저장
    const url = `${fileName}#${closest.id}`;
    const title = closest.innerText.trim() || "(제목 없음)";
    const data = { url, title };
    localStorage.setItem(storageKey, JSON.stringify(data));
    alert(`📌 '${title}' 위치를 기억했습니다!`);
  } else {
    // ⚠️ 제목이 보이지 않을 경우 안내 메시지 표시
    alert("⚠️ 현재 화면에 저장할 수 있는 소제목이 보이지 않습니다.\n조금 위나 아래로 스크롤한 후 다시 시도하세요.");
  }
}



function goToRememberedSection(storageKey, fallbackMessage) {
  const rawData = localStorage.getItem(storageKey);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed.url) {
        window.location.href = parsed.url;
        //        window.location.replace(parsed.url);  // ✅ 히스토리 쌓지 않음
      } else {
        alert(fallbackMessage);
      }
    } catch (e) {
      console.error("책갈피 데이터 파싱 오류:", e);
      alert(fallbackMessage);
    }
  } else {
    alert(fallbackMessage);
  }
}

// 전역 노출, 책갈피 저장이 없으면
window.goToRememberedPsalm = function () {
  goToRememberedSection('rememberedPsalm', '기억된 시편이 없습니다.');
};
window.goToRememberedCanticle1 = function () {
  goToRememberedSection('rememberedCanticle1', '기억된 송가가 없습니다.');
};
window.goToRememberedCanticle2 = function () {
  goToRememberedSection('rememberedCanticle2', '기억된 송가가 없습니다.');
};
window.goToRememberedCollect1 = function () {
  goToRememberedSection('rememberedCollect1', '기억된 본기도1이 없습니다.');
};
window.goToRememberedCollect2 = function () {
  goToRememberedSection('rememberedCollect2', '기억된 본기도2가 없습니다.');
};
window.goToRememberedPrayer1 = function () {
  goToRememberedSection('rememberedPrayer1', '기억된 간구기도1이 없습니다.');
};
window.goToRememberedPrayer2 = function () {
  goToRememberedSection('rememberedPrayer2', '기억된 간구기도2이 없습니다.');
};
window.goToRememberedPrayer3 = function () {
  goToRememberedSection('rememberedPrayer3', '기억된 간구기도3이 없습니다.');
};



// 책갈피 버튼
function updateBookmarkButton(storageKey, buttonId, defaultText) {
  const data = localStorage.getItem(storageKey);
  const btn = document.getElementById(buttonId);

  if (btn && data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.title) {
        btn.textContent = parsed.title;
      }
    } catch (e) {
      btn.textContent = defaultText;
    }
  } else if (btn) {
    btn.textContent = defaultText;
  }
}

// 전역으로 노출
window.updateBookmarkButton = updateBookmarkButton;


// 초기화 함수로 묶어서 재사용
function updateAllBookmarkButtons() {
  updateBookmarkButton('rememberedPsalm', 'bookmarkPsalmButton', '책갈피');
  updateBookmarkButton('rememberedLesson1', 'bookmarkLessonButton1', '책갈피');
  updateBookmarkButton('rememberedLesson2', 'bookmarkLessonButton2', '책갈피');
  updateBookmarkButton('rememberedCanticle1', 'bookmarkCanticleButton1', '책갈피1');
  updateBookmarkButton('rememberedCanticle2', 'bookmarkCanticleButton2', '책갈피2');
  updateBookmarkButton('rememberedCollect1', 'bookmarkCollectButton1', '책갈피1');
  updateBookmarkButton('rememberedCollect2', 'bookmarkCollectButton2', '책갈피2');
  updateBookmarkButton('rememberedPrayer1', 'bookmarkPrayerButton1', '책갈피1');
  updateBookmarkButton('rememberedPrayer2', 'bookmarkPrayerButton2', '책갈피2');
  updateBookmarkButton('rememberedPrayer3', 'bookmarkPrayerButton3', '책갈피3');
}

// DOM 로드 시 + 뒤로가기 복원 시 둘 다 대응
document.addEventListener('DOMContentLoaded', updateAllBookmarkButtons);
window.addEventListener('pageshow', updateAllBookmarkButtons);



function goToProperBookmark(index) {
  const data = localStorage.getItem(`rememberedProper${index}`);
  if (data) {
    const { path, targetId } = JSON.parse(data); // targetId = section1-proper3 처럼 되어 있어야 함
    if (path && targetId) {
      // 쿼리로 full ID 전달
      location.href = `${path}?proper=${targetId}#${targetId}`;
    }
  } else {
    alert(`책갈피 ${String.fromCharCode(64 + index)}에는 저장된 내용이 없습니다. 맨 위 특정문 [절기선택버튼]에서 절기를 선택해주세요`);
  }
}


function updateProperBookmarkLabels() {
  for (let i = 1; i <= 7; i++) {
    const buttons = document.querySelectorAll(`#bookmarkProper${i}`);
    const data = localStorage.getItem(`rememberedProper${i}`);
    const label = data ? (() => {
      try {
        return JSON.parse(data).label || `책갈피 ${String.fromCharCode(64 + i)}`;
      } catch {
        return `책갈피 ${String.fromCharCode(64 + i)}`;
      }
    })() : `책갈피 ${String.fromCharCode(64 + i)}`;

    buttons.forEach(btn => {
      btn.textContent = label;
    });
  }
}

document.addEventListener('DOMContentLoaded', updateProperBookmarkLabels);
window.addEventListener('pageshow', updateProperBookmarkLabels);



function clearAllBookmarks() {
  const keysToRemove = [
    'rememberedPsalm', 'rememberedLesson1', 'rememberedLesson2',
    'rememberedProper1', 'rememberedProper2', 'rememberedProper3',
    'rememberedProper4', 'rememberedProper5', 'rememberedProper6',
    'rememberedProper7', 'rememberedCanticle1', 'rememberedCanticle2',
    'rememberedCollect1', 'rememberedCollect2', 'rememberedPrayer1',
    'rememberedPrayer2', 'rememberedPrayer3',
  ];

  // 로컬 스토리지 데이터 제거
  keysToRemove.forEach(key => localStorage.removeItem(key));
  // 버튼 텍스트 복원
  const defaultLabels = {
    'bookmarkPsalmButton': '책갈피',
    'bookmarkLessonButton1': '책갈피',
    'bookmarkLessonButton2': '책갈피',
    'bookmarkProper1': '책갈피A',
    'bookmarkProper2': '책갈피B',
    'bookmarkProper3': '책갈피C',
    'bookmarkProper4': '책갈피D',
    'bookmarkProper5': '책갈피E',
    'bookmarkProper6': '책갈피F',
    'bookmarkProper7': '책갈피G',
    'bookmarkCanticleButton1': '책갈피1',
    'bookmarkCanticleButton2': '책갈피2',
    'bookmarkCollectButton1': '책갈피1',
    'bookmarkCollectButton2': '책갈피2',
    'bookmarkPrayerButton1': '책갈피1',
    'bookmarkPrayerButton2': '책갈피2',
    'bookmarkPrayerButton3': '책갈피3',
  };

  for (const [id, text] of Object.entries(defaultLabels)) {
    const buttons = document.querySelectorAll(`#${id}`);
    buttons.forEach(btn => btn.textContent = text);
  }

  alert('모든 책갈피가 초기화되었습니다.');
  toggleMenu(); // 사이드메뉴 닫기
}


//--------------------------------------------------------------

/**** 1️⃣ Service Worker 등록 ****/
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/kbcp/service-worker.js", { scope: "/kbcp/" })
      .then((reg) => {
        console.log("✅ Service Worker 등록 성공");

        // 기존 SW가 대기 중이면 업데이트 알림
        if (reg.waiting) promptUpdate(reg);

        // 새 SW가 설치 중이면 상태 감시
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              promptUpdate(reg);
            }
          });
        });

        // SW 교체 완료되면 자동 새로고침
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          window.location.reload();
        });
      })
      .catch((err) => console.error("❌ Service Worker 등록 실패:", err));
  });

  /**** 2️⃣ 새 버전 발견 시 사용자에게 안내 ****/
  function promptUpdate(reg) {
    if (confirm("📢 새 버전이 있습니다. 지금 업데이트할까요?")) {
      if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }
}


//-------------------------------------------------------------

// 사이드 메뉴 토글 함수
function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("open");
}

function closeMenuThenNavigate(url) {
  const menu = document.getElementById("sideMenu");
  if (menu && menu.classList.contains("open")) {
    menu.classList.remove("open");
  }
  setTimeout(() => {
    location.href = url;
  }, 150);
}

document.addEventListener('DOMContentLoaded', function () {
  const pageTitle = document.title;

  // 1️⃣ 설정 HTML
  const settingsHTML = `
  <div id="displaySettings" class="settings-panel" style="padding: 13px; font-size: 1.2em;">
    <label style="display: block; margin-bottom: 10px; font-size: 1em;">
      글자크기:
      <select id="fontSizeSelector" style="font-size: 1em; padding: 4px 6px; margin-left: 6px;">
        <option value="small">작게</option>
        <option value="medium" selected>보통</option>
        <option value="large">크게</option>
      </select>
    </label>

    <label style="display: block; font-size: 1em;">
      줄간간격:
      <select id="lineHeightSelector" style="font-size: 1em; padding: 4px 6px; margin-left: 6px;">
        <option value="tight">좁게</option>
        <option value="normal" selected>보통</option>
        <option value="wide">넓게</option>
      </select>
    </label>
  </div>
`;

const sideMenuHTML = `
  <div id="sideMenu" class="side-menu">
    <a href="javascript:void(0)" onclick="installPWA()" id="installPwa" style="display: none;">홈 화면에 설치</a>
    <a href="javascript:void(0)" onclick="clearAllBookmarks()">책갈피 초기화</a>
    <a href="javascript:void(0)" onclick="closeMenuThenNavigate('user-guide.html')">사용안내</a>
    <a href="javascript:void(0)" onclick="closeMenuThenNavigate('install-guide.html')">앱설치 방법</a>
    ${settingsHTML}
  </div>
`;

  // 3️⃣ 상단바 HTML
  const navbarHTML = `
      <div class="navbar">
        <div class="menu-icon" onclick="toggleMenu()">☰</div>
        <h1>${pageTitle}</h1>
      </div>
    `;

  // 4️⃣ 삽입
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  document.body.insertAdjacentHTML('beforeend', sideMenuHTML);

  // 5️⃣ 설정값 불러오기
  const fontSizeSelector = document.getElementById("fontSizeSelector");
  const lineHeightSelector = document.getElementById("lineHeightSelector");

  const savedFontSize = localStorage.getItem("fontSize") || "medium";
  const savedLineHeight = localStorage.getItem("lineHeight") || "normal";
  document.body.dataset.fontSize = savedFontSize;
  document.body.dataset.lineHeight = savedLineHeight;
  fontSizeSelector.value = savedFontSize;
  lineHeightSelector.value = savedLineHeight;

  fontSizeSelector.addEventListener("change", function () {
    document.body.dataset.fontSize = this.value;
    localStorage.setItem("fontSize", this.value);
  });

  lineHeightSelector.addEventListener("change", function () {
    document.body.dataset.lineHeight = this.value;
    localStorage.setItem("lineHeight", this.value);
  });

  // 6️⃣ # 링크 방지
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

});


//-----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const sideMenu = document.querySelector('.side-menu');
  const closeBtn = document.querySelector('.close-btn');

  const path = window.location.pathname;
  const filename = path.split('/').pop();  // ex) 'morning-prayer.html'

  // ✅ 기본 색상 - 검색과정 부분
  let themeColor = '#183b5c'; 

  // ✅ 색상 그룹 정의
  const colorRules = {
    //시작화면
    green: ['index.html'], 
    //기도서 예식부분
    red: [
      'morning-prayer.html', 'evening-prayer.html', 'noonday-prayer.html', 'compline-prayer.html',
      'ucharist-form1.html', 'ucharist-form2.html', 'baptism.html', 'reconciliation.html',
      'anointing-sick.html', 'commendatory-prayer.html', 'prayer-for-dead.html', 'coffin-prayer.html',
      'departure-prayer.html', 'cremate-prayer.html', 'burial-prayer.html', 'enshrining-prayer.html',
      'reception.html', 'vestry.html', 'maternity.html','matrimony.html', 'memorial-prayer.html',
      'non-believer.html', 'brief-prayer.html', 'blessing.html'
    ],
    //특정문 부분
    purple: [
      'collect-text.html', 'canticle-text.html', 'lesson1-text.html',
      'lesson2-text.html',  'prayer-text.html', 'psalm-text.html', 'proper-text.html'
    ]
  };

  // ✅ 색상 결정
  if (!filename || colorRules.green.includes(filename)) {
    themeColor = '#228b22'; // green
  } else if (colorRules.red.includes(filename)) {
    themeColor = '#a92103'; // red
  } else if (colorRules.purple.includes(filename)) {
    themeColor = '#650a9e'; // purple
  }

  // ✅ 색상 적용
  if (navbar) navbar.style.backgroundColor = themeColor;
  if (sideMenu) sideMenu.style.backgroundColor = themeColor;
  if (closeBtn) closeBtn.style.color = 'white';
});



function goToRememberedLessonGeneric(storageKey, fallbackFile, missingMessage) {
  const rawData = localStorage.getItem(storageKey);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed.url) {
        const match = parsed.url.match(/#(lesson\d+)/);
        if (match && match[1]) {
          const lessonId = match[1];
          // ✅ 항상 절대경로로 이동 (SW 스코프 안)
          window.location.href = `/kbcp/${fallbackFile}?lessonId=${lessonId}`;
        } else {
          // ✅ 기존 저장된 URL도 절대경로로 보정
          const absoluteUrl = parsed.url.startsWith("/kbcp/")
            ? parsed.url
            : `/kbcp/${parsed.url.replace(/^\//, "")}`;
          window.location.href = absoluteUrl;
        }
      } else {
        alert(missingMessage);
      }
    } catch (e) {
      console.error("책갈피 데이터 파싱 오류:", e);
      alert(missingMessage);
    }
  } else {
    alert(missingMessage);
  }
}


// 아침기도 정과표
window.goToRememberedLesson1 = function () {
  goToRememberedLessonGeneric('rememberedLesson1', 'lesson1-text.html', '기억된 성무일과 정과표가 없습니다.');
};

// 성찬례 정과표
window.goToRememberedLesson2 = function () {
  goToRememberedLessonGeneric('rememberedLesson2', 'lesson2-text.html', '기억된 성찬례 정과표가 없습니다.');
};




/* ================================
   ✅ 성공회 기도서 PWA 설치 스크립트
   ================================ */

let deferredPrompt = null;

// --- 1️⃣ 설치 안내 이벤트 (beforeinstallprompt) ---
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📦 beforeinstallprompt 발생');
  e.preventDefault();
  deferredPrompt = e;

  // 메뉴 생성 후 버튼 표시
  setTimeout(() => {
    const installBtn = document.getElementById('installPwa');
    if (installBtn) {
      installBtn.style.display = 'block';
      console.log('✅ 설치 버튼 표시됨');
    } else {
      console.warn('❗ installPwa 버튼을 찾을 수 없습니다.');
    }
  }, 100);
});

// --- 2️⃣ 설치 버튼 클릭 시 동작 ---
function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log("✅ 사용자 설치 수락");
      } else {
        console.log("❌ 사용자 설치 거부");
      }
      deferredPrompt = null;
    });
  } else {
    alert("이미 설치되었거나 설치 조건이 충족되지 않았습니다.");
  }
}

// --- 3️⃣ 설치 완료 이벤트 (한 번만 표시되게) ---
if (!window._kbcpAppInstalledListener) {
  window.addEventListener('appinstalled', () => {
    console.log("📱 appinstalled 이벤트 발생");

    // 중복 알림 방지 (localStorage 기반)
    if (!localStorage.getItem('kbcpInstalled')) {
      alert("✅ 성공회 기도서 앱이 설치되었습니다!");
      localStorage.setItem('kbcpInstalled', 'true');
    }
  });

  // 리스너 중복 등록 방지
  window._kbcpAppInstalledListener = true;
}



/* 이 부분은 성찬기도1 예식문 외에서 아코디언 기능을 쓸 때 필요함*/
document.addEventListener("DOMContentLoaded", function () {
  if (location.pathname.includes("ucharist-form1")) return;

  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(header => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

      if (isOpen) {
        content.style.maxHeight = "0px";
        this.classList.remove("open");
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        this.classList.add("open");

        setTimeout(() => {
          this.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    });
  });
});





