// main.js

// 사이드 메뉴 토글 함수
function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("open");
}


// text파일에서 예문으로 돌아갈 때 현재 화면 기억, lesson1-text와 lesson2-text가 같은 idPrefix에 'lesson'을 쓰는 것 주의.
function rememberClosest(idPrefix, storageKey, fileName) {
  const headings = document.querySelectorAll(`div.subtitle[id^="${idPrefix}"]`);
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const offsetMargin = 70;  // 상단바 높이. 필요에 따라 조정하세요.
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
    const url = `${fileName}#${closest.id}`;
    const title = closest.innerText;
    const data = { url, title };
    localStorage.setItem(storageKey, JSON.stringify(data)); // <-- 꼭 JSON.stringify 로 저장
    alert(`${title} 위치를 기억했습니다!`);
  }
}


//예문 책갈피에서 본문으로 찾아갈 때
function goToRememberedSection(storageKey, fallbackMessage) {
  const rawData = localStorage.getItem(storageKey);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData); // JSON 객체로 파싱
      if (parsed.url) {
        window.location.href = parsed.url;
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
window.goToRememberedLesson1 = function () {
  goToRememberedSection('rememberedLesson1', '기억된 성무일과 정과표가 없습니다.');
};
window.goToRememberedLesson2 = function () {
  goToRememberedSection('rememberedLesson2', '기억된 성찬례 정과표가 없습니다.');
};
window.goToRememberedCanticle1 = function () {
  goToRememberedSection('rememberedCanticle1', '기억된 송가가 없습니다.');
};
window.goToRememberedCanticle2 = function () {
  goToRememberedSection('rememberedCanticle2', '기억된 송가가 없습니다.');
};
window.goToRememberedCollect1 = function () {
  goToRememberedSection('rememberedCollect1', '기억된 본기도가 없습니다.');
};
window.goToRememberedCollect2 = function () {
  goToRememberedSection('rememberedCollect2', '기억된 본기도가 없습니다.');
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

// 전역으로 노출해 각 HTML에서 실행 가능하게
window.updateBookmarkButton = updateBookmarkButton;

document.addEventListener('DOMContentLoaded', function () {
  updateBookmarkButton('rememberedPsalm', 'bookmarkPsalmButton', '책갈피');
  updateBookmarkButton('rememberedLesson1', 'bookmarkLessonButton1', '책갈피');
  updateBookmarkButton('rememberedLesson2', 'bookmarkLessonButton2', '책갈피');
  updateBookmarkButton('rememberedCanticle1', 'bookmarkCanticleButton1', '책갈피');
  updateBookmarkButton('rememberedCanticle2', 'bookmarkCanticleButton2', '책갈피');
  updateBookmarkButton('rememberedCollect1', 'bookmarkCollectButton1', '책갈피1');
  updateBookmarkButton('rememberedCollect2', 'bookmarkCollectButton2', '책갈피1');
  updateBookmarkButton('rememberedPrayer1', 'bookmarkPrayerButton1', '책갈피1');
  updateBookmarkButton('rememberedPrayer2', 'bookmarkPrayerButton2', '책갈피2');
  updateBookmarkButton('rememberedPrayer3', 'bookmarkPrayerButton3', '책갈피3');
});



// 전역에 선언
function forceUpdate() {
  if ('serviceWorker' in navigator) {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log("📦 모든 캐시 삭제 완료");
      return navigator.serviceWorker.getRegistrations();
    }).then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
      alert("📢 앱이 최신 버전으로 업데이트되었습니다.\n새 파일로 다시 불러옵니다.");
      location.reload(true);
    }).catch((err) => {
      console.error("업데이트 중 오류 발생:", err);
      alert("⚠️ 업데이트 중 문제가 발생했습니다. 다시 시도해주세요.");
    });
  } else {
    alert("⚠️ 이 브라우저는 Service Worker를 지원하지 않습니다.");
  }
}

// DOM이 로드된 후 실행되는 부분
document.addEventListener('DOMContentLoaded', function () {
  const pageTitle = document.title;

  const sideMenuHTML = `
    <div id="sideMenu" class="side-menu">
      <span class="close-btn" onclick="toggleMenu()">×</span>
      <a href="#" onclick="forceUpdate()">버전 업데이트</a>
      <a href="#" onclick="clearAllBookmarks()">책갈피 초기화</a>
      <a href="#">글씨크기 조정하기</a>
      <a href="#">사용안내</a>
    </div>
  `;

  const navbarHTML = `
    <div class="navbar">
      <div class="menu-icon">☰</div>
      <h1>${pageTitle}</h1>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', sideMenuHTML + navbarHTML);

  const menuIcon = document.querySelector(".menu-icon");
  const closeBtn = document.querySelector(".close-btn");

  if (menuIcon && closeBtn) {
    menuIcon.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", function () {
      const sideMenu = document.getElementById("sideMenu");
      sideMenu.classList.remove("open");
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/kbcp/service-worker.js')
      .then(() => console.log('✅ Service Worker 등록 성공'))
      .catch(err => console.error('❌ Service Worker 등록 실패:', err));
  }
});



// 특정 위치 저장 (파일 경로와 위치를 함께 저장)
function rememberPosition(storageKey, elementId) {
  const targetElement = document.getElementById(elementId);

  if (targetElement) {
    const positionData = {
      path: window.location.pathname,  // 현재 파일 경로
      position: targetElement.offsetTop
    };

    localStorage.setItem(storageKey, JSON.stringify(positionData));
    console.log(`위치 저장됨: ${JSON.stringify(positionData)}`);
  } else {
    console.warn(`${elementId}가 존재하지 않습니다.`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const hash = window.location.hash;

  if (hash.startsWith('#scrollTo=')) {
    const position = parseInt(hash.replace('#scrollTo=', ''), 10);
    if (!isNaN(position)) {
      window.scrollTo(0, position);
    }
  }
});



//아침저녁시편필터보기
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const morningId = params.get('morningId');
  const eveningId = params.get('eveningId');
  const hash = window.location.hash.substring(1);

  let target = null;

  if (morningId) {
    target = document.querySelector(`[data-morning-id="${morningId}"]`);
  } else if (eveningId) {
    target = document.querySelector(`[data-evening-id="${eveningId}"]`);
  } else if (hash) {
    target = document.getElementById(hash);
  }
  if (target) {
    target.scrollIntoView();
    //target.scrollIntoView({ behavior: "smooth" });   이 부분을 위처럼 바꾸거나 "smooth" 대신 "auto" 로 바꾼다 
}
});


// 기억한 위치로 이동하는 함수 (파일 경로 포함)
function goToPosition(storageKey, elementId) {
  const savedData = localStorage.getItem(storageKey);

  if (savedData) {
    try {
      const { path, position } = JSON.parse(savedData);

      if (path && position !== undefined) {
        // 현재 경로와 저장된 경로가 다르면 해당 파일로 이동
        if (window.location.pathname !== path) {
          window.location.href = `${path}#${elementId}`;
        } else {
          // 같은 파일이라면 직접 스크롤
          const targetElement = document.getElementById(elementId);

          if (targetElement) {
            window.scrollTo(0, targetElement.offsetTop);
          } else {
            console.warn(`${elementId} 요소가 존재하지 않습니다. 저장된 위치로 이동합니다.`);
            window.scrollTo(0, position);
          }
        }
      } else {
        console.warn('저장된 경로 또는 위치가 유효하지 않습니다.');
      }
    } catch (e) {
      console.error('위치 데이터 파싱 오류:', e);
    }
  } else {
    console.warn(`${storageKey}에 저장된 위치가 없습니다.`);
  }
}



/* 상단바색을 다르게 주기 */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const sideMenu = document.querySelector('.side-menu');
  const closeBtn = document.querySelector('.close-btn');

  const path = window.location.href;

  let themeColor = '#183b5c'; // 기본

  if (path.includes('index') || path.endsWith('/') || path.endsWith('index.html')) {
    themeColor = '#228b22'; // 확실하게 index로 처리
  } else if (path.includes('ucharist-form1')) {
    themeColor = '#9e150e';
  } else if (path.includes('ucharist-form2')) {
    themeColor = '#9e150e';
  } else if (path.includes('morning-prayer')) {
    themeColor = '#dd4845';
  } else if (path.includes('evening-prayer')) {
    themeColor = '#9e150e';
  } else if (path.includes('text-select')) {
    themeColor = '#9e150e';
  }

  if (navbar) {
    navbar.style.backgroundColor = themeColor;
  }

  if (sideMenu) {
    sideMenu.style.backgroundColor = themeColor;
  }

  if (closeBtn) {
    closeBtn.style.color = 'white'; // 또는 필요에 따라 변경
  }
});


function goToProperBookmark(index) {
  const data = localStorage.getItem(`rememberedProper${index}`);
  if (data) {
    const { path, targetId } = JSON.parse(data); // targetId = section1-proper3 처럼 되어 있어야 함
    if (path && targetId) {
      // 쿼리로 full ID 전달
      location.href = `${path}?proper=${targetId}#${targetId}`;
    }
  } else {
    alert(`책갈피 ${String.fromCharCode(64 + index)}에는 저장된 내용이 없습니다.`);
  }
}


function updateProperBookmarkLabels() {
  for (let i = 1; i <= 7; i++) {
    const btn = document.getElementById(`bookmarkProper${i}`);
    const data = localStorage.getItem(`rememberedProper${i}`);
    if (btn && data) {
      try {
        const { label } = JSON.parse(data);
        btn.textContent = label || `책갈피 ${String.fromCharCode(64 + i)}`;
      } catch (e) {
        btn.textContent = `책갈피 ${String.fromCharCode(64 + i)}`;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', updateProperBookmarkLabels);







function goToRememberedLessonGeneric(storageKey, fallbackFile, missingMessage) {
  const rawData = localStorage.getItem(storageKey);
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed.url) {
        const match = parsed.url.match(/#(lesson\d+)/);
        if (match && match[1]) {
          const lessonId = match[1];
          window.location.href = `${fallbackFile}?lessonId=${lessonId}`;
        } else {
          window.location.href = parsed.url;
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



function clearAllBookmarks() {
  const keysToRemove = [
    'rememberedPsalm',
    'rememberedLesson1',
    'rememberedLesson2',
    'rememberedProper1',
    'rememberedProper2',
    'rememberedProper3',
    'rememberedProper4',
    'rememberedProper5',
    'rememberedProper6',
    'rememberedProper7',
    'rememberedCanticle1', 
    'rememberedCanticle2', 
    'rememberedCollect1', 
    'rememberedCollect2', 
    'rememberedPrayer1', 
    'rememberedPrayer2', 
    'rememberedPrayer3',
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
    'bookmarkCanticleButton1': '책갈피',
    'bookmarkCanticleButton2': '책갈피',
    'bookmarkCollectButton1': '책갈피',
    'bookmarkCollectButton2': '책갈피',
    'bookmarkPrayerButton1': '책갈피',
    'bookmarkPrayerButton2': '책갈피',
    'bookmarkPrayerButton3': '책갈피',
  };

  for (const [id, text] of Object.entries(defaultLabels)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.textContent = text;
    }
  }

  alert('모든 책갈피가 초기화되었습니다.');
  toggleMenu(); // 사이드메뉴 닫기
}


