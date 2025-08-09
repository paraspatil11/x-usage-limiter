document.getElementById("reset").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset" }, () => {
    window.location.href = "https://x.com";
  });
});
