// main.js

// 사이드 메뉴 토글 함수
function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("open");
}


// DOM이 로드된 후 이벤트를 등록
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon");
  const closeBtn = document.querySelector(".close-btn");

  // 햄버거 버튼 클릭 시 메뉴 토글
  menuIcon.addEventListener("click", toggleMenu);

  // 닫기 버튼 클릭 시 메뉴 닫기
  closeBtn.addEventListener("click", function () {
    const sideMenu = document.getElementById("sideMenu");
    sideMenu.classList.remove("open");
  });
});


//--------------------------------------------------------------------------------------

//본문에서 예문으로 돌아갈 때 현재 화면 기억
function rememberClosest(idPrefix, storageKey, fileName) {
  const headings = document.querySelectorAll(`div.subtitle[id^="${idPrefix}"]`);
  const scrollY = window.scrollY;
  let closest = null;
  let closestDistance = Infinity;

  headings.forEach(heading => {
    const distance = Math.abs(heading.offsetTop - scrollY);
    if (distance < closestDistance) {
      closest = heading;
      closestDistance = distance;
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
window.goToRememberedCanticle = function () {
  goToRememberedSection('rememberedCanticle', '기억된 송가가 없습니다.');
};
window.goToRememberedCollect = function () {
  goToRememberedSection('rememberedCollect', '기억된 본기도가 없습니다.');
};
window.goToRememberedPrayer = function () {
  goToRememberedSection('rememberedPrayer', '기억된 간구기도가 없습니다.');
};
window.goToRememberedLesson = function () {
  goToRememberedSection('rememberedLesson', '기억된 정과표가 없습니다.');
};


// 기억된 위치 표시를 예식문 책갈피 버튼 이름으로 보여주기
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

function tryExit() {
  alert("앱을 종료하려면 브라우저를 닫거나 홈 화면에서 앱닫기를 하세요.");
 }

