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

  // update local storage with new data from popup.js
  await chrome.runtime.onMessage.addListener((request) => {
    // check if there is a message
    if (request) {
      arr.length = 0; // set storage array to 0 so that it doesn't add the old data when new data is pushed
      arr.push(...request.message);
    }
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener((text) => {
    // check if key already exists
    for (const key of arr) {
      if (date === key.name) {
        // if it does, add a new note to it
        key.note.push({
          url: text.pageUrl,
          text: text.selectionText,
        });
        return;
      }
    }
    // if it doesn't, create a new key
    arr.push({
      name: date,
      note: [{
        url: text.pageUrl,
        text: text.selectionText,
      }]
    });
  });

  // add note to local storage
  chrome.contextMenus.onClicked.addListener(async () => {
    await chrome.storage.session.set({ "selectedText": arr });
  });
  console.log({ arr });
})();
