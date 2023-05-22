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
  const noteList = document.querySelector('.noteList');

  // TODO:
  // add a color picker but limit it to only some optimizied colors that won't clash with the design

  // TODO:
  // add an options page that explains what the app does and how it works, adds a way to clear local storage, add a color picker to customize the app

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
    for (const keys of selectedText) {
      keys.customNote = false;
      if (keys.active) {
        keys.customNote = true;
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // add custom note input value to local storage or allow user to edit note
  async function submitCustomNote(e) {
    e.preventDefault();
    const titleInput = document.querySelector('.titleInput');
    const textInput = document.querySelector('.textInput');
    const submitButton = document.querySelector('.confirmNoteButton');

    if (e.target === submitButton) {
      requestSubmit(submitButton);
    }

    // add a custom note
    for (const key of selectedText) {
      if (key.customNote && key.active) {
        key.note.push({
          edit: false,
          id: self.crypto.randomUUID(),
          title: titleInput.value,
          text: textInput.value,
        });
        key.customNote = false;
      }
    }

    // if edit property is true
    for (const keys of selectedText) {
      for (const key of keys.note) {
        if (key.edit) {
          // add storage values to input values, remove duplicate notes
          key.title = titleInput.value;
          key.text = textInput.value;
          keys.customNote = false;
          key.edit = false;
          keys.note.pop();
        }
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
    location.reload();
  }

  // allows user to edit the note
  async function editNote(e) {
    for (const keys of selectedText) {
      for (const key of keys.note) {
        key.edit = false;
        // if the edit property is true
        if (keys.active && e.target.id === key.id) {
          keys.customNote = true;
          key.edit = true;

          // add the text and title values to storage
          chrome.storage.session.set({
            "storedNote": {
              id: key.id,
              title: key.title,
              text: key.text,
            }
          });
          location.reload();
        }
      }
    }

    await chrome.storage.session.set({ "selectedText": selectedText });
    await chrome.runtime.sendMessage({ message: selectedText });
  }

  deleteNotesButton.addEventListener('click', deleteCheckedInput);
  deleteCategoryButton.addEventListener('click', deleteCategory);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
  renameButton.addEventListener('click', renameCategory);
  createNewNoteButton.addEventListener('click', addCustomNote);
  renameForm.addEventListener('submit', submitNewName);
  createNewNote.addEventListener('submit', submitCustomNote);
  noteList.addEventListener('click', editNote);
})();