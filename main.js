// main.js

// 사이드 메뉴 토글 함수
function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("open");
}


// 본문에서 예문으로 돌아갈 때 현재 화면 기억
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
window.goToRememberedLesson = function () {
  goToRememberedSection('rememberedLesson', '기억된 정과표가 없습니다.');
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
  updateBookmarkButton('rememberedLesson', 'bookmarkLessonButton', '책갈피');
  updateBookmarkButton('rememberedCanticle1', 'bookmarkCanticleButton1', '책갈피');
  updateBookmarkButton('rememberedCanticle2', 'bookmarkCanticleButton2', '책갈피');
  updateBookmarkButton('rememberedCollect1', 'bookmarkCollectButton1', '책갈피1');
  updateBookmarkButton('rememberedCollect2', 'bookmarkCollectButton2', '책갈피1');
  updateBookmarkButton('rememberedPrayer1', 'bookmarkPrayerButton1', '책갈피1');
  updateBookmarkButton('rememberedPrayer2', 'bookmarkPrayerButton2', '책갈피2');
  updateBookmarkButton('rememberedPrayer3', 'bookmarkPrayerButton3', '책갈피3');
});




document.addEventListener('DOMContentLoaded', function () {
  const pageTitle = document.title;

  // 사이드 메뉴 및 네비게이션 바 생성
  const sideMenuHTML = `
    <div id="sideMenu" class="side-menu">
      <span class="close-btn" onclick="toggleMenu()">×</span>
      <a href="#">홈 바로가기 만들기</a>
      <a href="#">버전 업데이트</a>
      <a href="#">책갈피 초기화</a>
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

  // 이벤트 리스너 등록
  const menuIcon = document.querySelector(".menu-icon");
  const closeBtn = document.querySelector(".close-btn");

  if (menuIcon && closeBtn) {
    menuIcon.addEventListener("click", toggleMenu);

    closeBtn.addEventListener("click", function () {
      const sideMenu = document.getElementById("sideMenu");
      sideMenu.classList.remove("open");
    });
  }


  // Service Worker 등록
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker 등록됨"))
      .catch(err => console.error("Service Worker 등록 실패:", err));
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
    /* target.scrollIntoView({ behavior: "smooth" });   이 부분을 위처럼 바꾸거나 "smooth" 대신 "auto" 로 바꾼다 */
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
  } else if (path.includes('morning-prayer')) {
    themeColor = '#9e150e';
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

