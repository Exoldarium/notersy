// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Note taker",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
});

(async () => {
  // grab data from local storage
  const res = await chrome.storage.local.get('selectedText');
  const data = res.selectedText;
  data.shift();

  // update local storage with new data from popup.js
  chrome.runtime.onMessage.addListener((request) => {
    console.log(request.message);
    data.length = 0;
    data.push(...request.message);
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener((text) => {
    data.push({
      url: text.pageUrl,
      text: text.selectionText,
    });
    chrome.storage.local.set({ "selectedText": data });
  });
  console.log({ data });
})();
