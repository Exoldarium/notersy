// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Note taker",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
});

// grab the highlighted text
chrome.contextMenus.onClicked.addListener((text) => {
  const selectedText = text.selectionText;
  chrome.storage.local.set({ "selectedText": selectedText });
  // console.log(selectedText);
});