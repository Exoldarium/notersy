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
  arr.push(text.selectionText);
  chrome.storage.local.set({ "selectedText": arr });
});