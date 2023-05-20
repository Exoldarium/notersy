(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const categoryList = document.querySelector(".categoryList");
  const deleteNotesButton = document.querySelector(".deleteNotesButton");
  const deleteCategoryButton = document.querySelector(".deleteCategoryButton");
  const renameForm = document.querySelector(".renameCategory");
  const renameButton = document.querySelector('.renameButton');
  const createNewNote = document.querySelector('.createNewNote');
  const createNewNoteButton = document.querySelector('.createNewNoteButton');

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
      key.customNote = false;
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

  // deletes active category
  async function deleteCategory() {
    for (const keys of selectedText) {
      if (keys.active) {
        if (window.confirm(`Are you sure you want to delete ${keys.name} and all the notes in it?`)) {
          const index = selectedText.indexOf(keys);
          selectedText.splice(index, 1);
        }
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // renders rename menu on button click
  async function renameCategory() {
    for (const key of selectedText) {
      key.rename = false;
      if (key.active) {
        key.rename = true;
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // grabs user input and renames the category
  async function submitNewName(e) {
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

  // allow user to add custom notes
  async function addCustomNote() {
    for (const key of selectedText) {
      key.customNote = false;
      if (key.active) {
        key.customNote = true;
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // add custom note input value to local storage
  async function submitCustomNote(e) {
    e.preventDefault();
    const titleInput = document.querySelector('.titleInput');
    const textInput = document.querySelector('.textInput');
    const submitButton = document.querySelector('.confirmNoteButton');

    if (e.target === submitButton) {
      requestSubmit(submitButton);
    }

    for (const key of selectedText) {
      if (key.customNote && key.active) {
        key.note.push({
          title: titleInput.value,
          text: textInput.value,
        });
        key.customNote = false;
      }
    }
    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  deleteNotesButton.addEventListener('click', deleteCheckedInput);
  deleteCategoryButton.addEventListener('click', deleteCategory);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
  renameButton.addEventListener('click', renameCategory);
  createNewNoteButton.addEventListener('click', addCustomNote);
  renameForm.addEventListener('submit', submitNewName);
  createNewNote.addEventListener('submit', submitCustomNote);
})();