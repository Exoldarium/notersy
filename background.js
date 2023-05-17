// add extension to context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "title": "Note taker",
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

// TODO:
// we could try adding new categories through the context menu
// the user could choose to add create a new category or just add the note which will create category with date as title
// context menu could be something like, add new category, add to currently active category

(async () => {
  // grab data from storage or initialize an empty array if there's nothing in storage
  const res = await chrome.storage.session.get('selectedText');
  const arr = res.selectedText || [];
  const date = new Date().toString().slice(0, 15);

  // update session storage with new data from popup.js
  chrome.runtime.onMessage.addListener((request) => {
    // check if there is a message
    if (request) {
      arr.length = 0; // set array to 0 so that it doesn't add old data when new data is pushed
      arr.push(...request.message);
    }
  });

  // add new notes on context menu click
  chrome.contextMenus.onClicked.addListener((text) => {
    // creates a new category
    if (text.menuItemId === 'addCategoryId') {
      arr.push({
        date: date,
        active: true,
        id: self.crypto.randomUUID(),
        name: `New category`,
        note: []
      });
    }

    if (text.menuItemId === 'addNoteId') {
      // check if key already exists
      for (const key of arr) {
        // if category is active (clicked), notes are pushed to that category
        if (key.active) {
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
        active: true,
        id: self.crypto.randomUUID(),
        name: `New category`,
        note: [{
          url: text.pageUrl,
          text: text.selectionText,
        }]
      });
    }
  });

  // add note to session storage
  // TODO:
  // don't forget to change to local storage
  chrome.contextMenus.onClicked.addListener(() => {
    chrome.storage.session.set({ "selectedText": arr });
  });
  console.log({ arr });
})();
