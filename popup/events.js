(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const categoryList = document.querySelector(".categoryList");
  const deleteButton = document.querySelector(".deleteButton");

  // track how many times the button has been clicked, we don't want to duplicate notes
  let counter = 0;
  async function displayNotesOnCategoryClick(e) {
    console.log(e.target);
    if (counter >= 1) {
      return;
    }

    // if the category is clicked set active to true, if not set it to false
    for (const key of selectedText) {
      key.active = false;
      if (e.target.id === key.id) {
        counter += 1;
        key.active = true;
      }
    }

    // update storage and send it to background.js
    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    // rerender the html every time the button is clicked so that correct category is displayed
    location.reload();
  }

  // delete selected notes
  async function deleteCheckedInput() {
    const input = document.querySelectorAll('input[type="checkbox"]');
    input.forEach(input => {
      // check if input is checked
      if (input.checked) {
        for (const keys of selectedText) {
          for (const key of keys.note) {
            // if the text content of the key matches selected input id (i'm using note text as id)
            if (key.text === input.id) {
              // remove that key
              const index = keys.note.indexOf(key);
              keys.note.splice(index, 1);
            }
          }
        }
      }
    });

    // update session storage
    await chrome.storage.session.set({ "selectedText": selectedText });
    // send message to background.js with the new storage data
    await chrome.runtime.sendMessage({ message: selectedText });
    // rerender popup on successful delete
    location.reload();
  }

  deleteButton.addEventListener('click', deleteCheckedInput);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
})();