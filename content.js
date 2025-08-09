function checkBlock() {
  chrome.storage.local.get("blocked", (data) => {
    if (data.blocked) {
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:black;color:white;font-size:24px;">
          <p>⏳ Time’s up for today!</p>
          <p>Come back tomorrow or reset the timer.</p>
        </div>
      `;
    }
  });
}

// Run every second
setInterval(checkBlock, 1000);
