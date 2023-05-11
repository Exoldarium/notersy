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

  // update local storage with new data from popup.js
  chrome.runtime.onMessage.addListener((request) => {
    res.selectedText.length = 0; // set storage array to 0 so that it doesn't add the old data when new data is pushed
    res.selectedText.push(...request.message);
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener((text) => {
    res.selectedText.push({
      url: text.pageUrl,
      text: text.selectionText,
    });
    chrome.storage.local.set({ "selectedText": res.selectedText });
  });
})();
