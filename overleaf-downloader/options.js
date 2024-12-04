// options.js

// 保存选项到chrome.storage
function saveOptions() {
  const inactivityLimit = parseInt(document.getElementById('inactivityLimit').value, 10);
  
  if (isNaN(inactivityLimit) || inactivityLimit < 1) {
    alert('请输入有效的分钟数（大于0）。');
    return;
  }

  chrome.storage.sync.set({ inactivityLimit: inactivityLimit }, () => {
    // 更新状态以告诉用户保存成功
    const status = document.getElementById('status');
    status.textContent = '设置已保存。';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// 恢复选项的值
function restoreOptions() {
  chrome.storage.sync.get({ inactivityLimit: 5 }, (items) => {
    document.getElementById('inactivityLimit').value = items.inactivityLimit;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
