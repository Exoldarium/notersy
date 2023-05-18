(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const categoryList = document.querySelector(".categoryList");
  const deleteButton = document.querySelector(".deleteButton");
  const renameForm = document.querySelector(".renameCategory");

  // TODO:
  // adding custom notes could be done separately, through the popup, not through context menu
  // custom notes can only be added to already created categories
  // when the category is clicked the button should appear to create a new note
  // when the button is clicked a textbox is created and the popup is reloaded
  // the user can input the note in the textbox and when finished confirms the text, reload the popup again to display the note
  // these custom notes could be saved under a separate name in storage

  // track how many times the button has been clicked, we don't want to duplicate notes
  let counter = 0;
  async function displayNotesOnCategoryClick(e) {
    if (counter >= 1) {
      return;
    }

    // if the category is clicked set active to true, if not set it to false
    for (const key of selectedText) {
      key.active = false;
      key.rename = false;
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
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // renders rename menu on button click
  async function renameCategory(e) {
    if (e.target.textContent === 'Set a new name') {
      for (const key of selectedText) {
        key.rename = false;
        if (e.target.id === key.id) {
          key.rename = true;
        }
      }
    }
    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
  }

  // grabs user input and renames the category
  async function getRenameInput(e) {
    e.preventDefault();
    const input = document.querySelector('input[type="text"]');
    const submitButton = document.querySelector('.confirmButton');

    if (e.target === submitButton) {
      requestSubmit(submitButton);
    }

    // update the category name with new name
    for (const key of selectedText) {
      if (key.rename) {
        key.name = input.value;
        key.rename = false;
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  deleteButton.addEventListener('click', deleteCheckedInput);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
  categoryList.addEventListener('click', renameCategory);
  renameForm.addEventListener('submit', getRenameInput);
})();