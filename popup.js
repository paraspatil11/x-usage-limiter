document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("time");
  const resetBtn = document.getElementById("reset");

  function updateTimerDisplay() {
    chrome.storage.local.get(["twitterTime", "blocked"], (data) => {
      const time = data.twitterTime || 0;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const blockedText = data.blocked ? " (Blocked)" : "";
      timeEl.textContent = `${minutes}m ${seconds}s${blockedText}`;
    });
  }

  resetBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "reset" });
    updateTimerDisplay();
  });

  updateTimerDisplay();
  setInterval(updateTimerDisplay, 1000);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "blocked") {
    document.getElementById("status").innerText = "Blocked!";
  }
});

