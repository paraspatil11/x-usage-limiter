const LIMIT = 60; 
let activeTabId = null;
let intervalId = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ twitterTime: 0, blocked: false });
  console.log("Extension installed, timer reset");
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (tab.url && tab.url.includes("x.com")) {
      console.log("X.com tab detected:", tab.url);
      startTracking(tabId);
    } else if (tabId === activeTabId) {
      console.log("User navigated away from X.com");
      stopTracking();
    }
  }
});


chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && tab.url.includes("x.com")) {
      console.log("Switched to X.com tab:", tab.url);
      startTracking(activeInfo.tabId);
    } else {
      stopTracking();
    }
  });
});

function startTracking(tabId) {
  if (intervalId) return; 
  activeTabId = tabId;
  console.log("Started tracking time");

  intervalId = setInterval(() => {
    chrome.storage.local.get(["twitterTime", "blocked"], (data) => {
      if (!data.blocked) {
        let newTime = (data.twitterTime || 0) + 1;
        let blocked = newTime >= LIMIT;

        chrome.storage.local.set({ twitterTime: newTime, blocked });

        console.log(`Updated twitterTime: ${newTime}s, Blocked: ${blocked}`);

       
        if (blocked) {
          console.log("⛔ Limit reached. Blocking X.com.");
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              if (tab.url && tab.url.includes("x.com")) {
                chrome.tabs.update(tab.id, {
                  url: chrome.runtime.getURL("blocked.html")
                });
              }
            });
          });
        }
      }
    });
  }, 1000);
}

function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    activeTabId = null;
    console.log("Stopped tracking time");
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "reset") {
    chrome.storage.local.set({ twitterTime: 0, blocked: false });
    console.log("Timer reset via popup");
  }
});


chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.includes("x.com")) {
    chrome.storage.local.get(["blocked"], (data) => {
      if (data.blocked) {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocked.html")
        });
      }
    });
  }
});
