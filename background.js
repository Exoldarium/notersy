
// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Note taker",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
});

const arr = [];

// grab the highlighted text and add it to an array
chrome.contextMenus.onClicked.addListener((text) => {
  arr.push({
    url: text.pageUrl,
    text: text.selectionText,
    id: self.crypto.randomUUID(),
  });
  chrome.storage.local.set({ "selectedText": arr });
});