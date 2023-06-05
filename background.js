// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Note Taker",
    "contexts": ["selection"],
    "id": "menuItemId",
  });
  chrome.contextMenus.create({
    "title": "Add a new note",
    "contexts": ["selection"],
    "parentId": "menuItemId",
    "id": "addNoteId"
  });
  chrome.contextMenus.create({
    "title": "Add a new category",
    "contexts": ["selection"],
    "parentId": "menuItemId",
    "id": "addCategoryId"
  });
});

(async () => {
  // grab data from storage or initialize an empty array if there's nothing in storage
  const res = await chrome.storage.local.get('selectedText');
  const arr = res.selectedText || [];
  const date = new Date().toString().slice(0, 15);

  // update local storage with new data from popup.js
  chrome.runtime.onMessage.addListener(async (request) => {
    const res = await request;
    // check if there is a message
    if (res.message) {
      arr.length = 0; // set array to 0 so that it doesn't add old data when new data is pushed
      arr.push(...res.message);
    }
    if (res.clear) {
      arr.length = 0;
    }
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener((text) => {
    // creates a new category
    if (text.menuItemId === 'addCategoryId') {
      arr.push({
        date: date,
        active: false,
        rename: false,
        customNote: false,
        editNote: false,
        id: self.crypto.randomUUID(),
        name: "New category",
        note: []
      });
    }

    if (text.menuItemId === 'addNoteId') {
      // check if key already exists
      for (const key of arr) {
        // if category is active (clicked), notes are pushed to that category
        if (key.active) {
          key.note.push({
            id: self.crypto.randomUUID(),
            edit: false,
            title: text.pageUrl,
            text: text.selectionText,
          });
          return;
        }
      }

      // if it doesn't, create a new key
      arr.push({
        date: date,
        active: true,
        rename: false,
        customNote: false,
        editNote: false,
        id: self.crypto.randomUUID(),
        name: "New Category",
        note: [{
          id: self.crypto.randomUUID(),
          edit: false,
          title: text.pageUrl,
          text: text.selectionText,
        }]
      });
    }
  });

  // add note to local storage
  chrome.contextMenus.onClicked.addListener(() => {
    chrome.storage.local.set({ "selectedText": arr });
  });
})();