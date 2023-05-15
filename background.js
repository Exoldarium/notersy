// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Save a note",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
});

(async () => {
  // grab data from storage or initialize an empty array if there's nothing in storage
  const res = await chrome.storage.session.get('selectedText');
  const arr = res.selectedText || [];
  const date = new Date().toString().slice(0, 15);

  // update session storage with new data from popup.js
  await chrome.runtime.onMessage.addListener((request) => {
    // check if there is a message
    if (request) {
      arr.length = 0; // set array to 0 so that it doesn't add old data when new data is pushed
      arr.push(...request.message);
    }
  });

  // add new notes on context menu click
  await chrome.contextMenus.onClicked.addListener((text) => {
    // check if key already exists
    for (const key of arr) {
      // by default notes are pushed to the current date category
      if (date === key.date) {
        key.note.push({
          url: text.pageUrl,
          text: text.selectionText,
        });
        return;
      }
      // if category is active (clicked), notes are pushed to that category
      else if (key.active) {
        key.note.push({
          url: text.pageUrl,
          text: text.selectionText,
        });
        return;
      }
    }

    // if it doesn't, create a new key
    arr.push({
      date: date,
      active: false,
      note: [{
        url: text.pageUrl,
        text: text.selectionText,
      }]
    });
  });

  // add note to session storage
  await chrome.contextMenus.onClicked.addListener(() => {
    chrome.storage.session.set({ "selectedText": arr });
  });
  console.log({ arr });
})();
