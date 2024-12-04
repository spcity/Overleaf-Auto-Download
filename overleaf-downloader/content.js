// content.js

(function() {
  let timeoutId;
  let INACTIVITY_LIMIT = 5 * 60 * 1000; // 默认5分钟

  // 获取用户设置的INACTIVITY_LIMIT
  function getInactivityLimit() {
    chrome.storage.sync.get({ inactivityLimit: 5 }, (items) => {
      INACTIVITY_LIMIT = items.inactivityLimit * 60 * 1000; // 转换为毫秒
      resetTimer(); // 重新设置计时器
    });
  }

  // 重置计时器
  function resetTimer() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(handleInactivity, INACTIVITY_LIMIT);
  }

  // 处理无操作时的逻辑
  function handleInactivity() {
    const currentUrl = window.location.href;

    if (currentUrl === "https://www.overleaf.com/project") {
      // URL 是 https://www.overleaf.com/project
      const selector = "#main-content > div > div.project-list-main-react > div:nth-child(6) > div > div > table > tbody > tr:nth-child(1) > td.dash-cell-actions > div.d-none.d-md-block > span:nth-child(2) > button > span > span";
      const button = document.querySelector(selector);
      if (button) {
        button.click();
        console.log("已点击下载按钮（主项目页面）");
      } else {
        console.log("未找到下载按钮（主项目页面）");
      }
    } else if (/^https:\/\/www\.overleaf\.com\/project\/.+$/.test(currentUrl)) {
      // URL 是 https://www.overleaf.com/project/<suffix>
      // 点击第一个按钮
      const firstButtonSelector = "#ide-root > div.ide-react-main > header > div.toolbar-left > div:nth-child(1) > button";
      const firstButton = document.querySelector(firstButtonSelector);
      if (firstButton) {
        firstButton.click();
        console.log("已点击下载菜单按钮");

        // 等待弹出窗口出现，然后点击下载链接
        setTimeout(() => {
          const downloadLinkSelector = "#left-menu > ul.list-unstyled.nav.nav-downloads.text-center > li:nth-child(1) > a";
          const downloadLink = document.querySelector(downloadLinkSelector);
          if (downloadLink) {
            downloadLink.click();
            console.log("已点击下载链接");
          } else {
            console.log("未找到下载链接");
          }
        }, 1000); // 根据实际情况调整延迟时间
      } else {
        console.log("未找到下载菜单按钮");
      }
    } else {
      console.log("当前URL不符合下载条件");
    }
  }

  // 监听用户活动事件
  function setupActivityListeners() {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);
  }

  // 初始化
  function init() {
    getInactivityLimit();
    setupActivityListeners();
  }

  // 监听设置更改
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.inactivityLimit) {
      INACTIVITY_LIMIT = changes.inactivityLimit.newValue * 60 * 1000;
      resetTimer();
    }
  });

  // 启动插件
  init();
})();
