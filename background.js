// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Save a note",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
});

(async () => {
  // initialize empty array to store data
  const arr = [];
  console.log(arr);
  // update local storage with new data from popup.js
  chrome.runtime.onMessage.addListener((request) => {
    if (request) {
      arr.length = 0; // set storage array to 0 so that it doesn't add the old data when new data is pushed
      arr.push(...request.message);
    }
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener(async (text) => {
    arr.push({
      url: text.pageUrl,
      text: text.selectionText,
    });
    await chrome.storage.session.set({ "selectedText": arr });
  });
})();
