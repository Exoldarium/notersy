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
  const date = new Date().toString().slice(0, 15);
  console.log({ arr });

  // update local storage with new data from popup.js
  await chrome.runtime.onMessage.addListener((request) => {
    // check if there is a message
    if (request) {
      arr.length = 0; // set storage array to 0 so that it doesn't add the old data when new data is pushed
      arr.push(...request.message);
    }
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener(async (text) => {
    // try to add some if logic here in order to make the correct push
    for (const key of arr) {
      if (date === key.name) {
        key.note.push({
          url: text.pageUrl,
          text: text.selectionText,
        });
        return
      }
    }
    arr.push({
      name: date,
      note: [{
        url: text.pageUrl,
        text: text.selectionText,
      }]
    });
    chrome.storage.session.set({ "selectedText": arr });
  });
})();
