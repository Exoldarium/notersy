(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const storedInputValuesRes = await chrome.storage.local.get('storedInputValues');
  const storedInputValues = storedInputValuesRes.storedInputValues;
  const selectedText = res.selectedText || [];
  const date = new Date().toString().slice(0, 15);

  console.log(storedInputValuesRes);

  const categoryList = document.querySelector(".categoryList");
  const deleteNotesButton = document.querySelector(".deleteNotesButton");
  const deleteCategoryButton = document.querySelector(".deleteCategoryButton");
  const renameForm = document.querySelector(".renameCategory");
  const renameButton = document.querySelector('.renameButton');
  const createNewNote = document.querySelector('.createNewNote');
  const createNewNoteButton = document.querySelector('.createNewNoteButton');
  const noteList = document.querySelector('.noteList');
  const newCategoryButton = document.querySelector('.createNewCategory');

  // TODO:
  // add a color picker but limit it to only some optimizied colors that won't clash with the design

  // TODO: 
  // see how to make storedInputValues empty when submiting a note

  // TODO: 
  // try to fix async so that we can test it

  // rerender the html every time storage changes
  chrome.storage.onChanged.addListener((change) => {
    if (change.selectedText || change.storedNote) {
      location.reload();
    }
  });

  // track how many times the button has been clicked, we don't want to duplicate notes
  let counter = 0;
  function displayNotesOnCategoryClick(e) {
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

    // update storage
    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // delete selected notes
  function deleteCheckedInput() {
    const input = document.querySelectorAll('input[type="checkbox"]');

    input.forEach(input => {
      for (const keys of selectedText) {
        for (const key of keys.note) {
          // if the text content of the key matches selected input id (i'm using note text as id) and input is checked
          if (key.text === input.id && input.checked) {
            // remove that key
            const index = keys.note.indexOf(key);
            keys.note.splice(index, 1);
          }
        }
      }
    });

    // update local storage
    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // deletes active category
  async function deleteCategory() {
    for (const keys of selectedText) {
      if (keys.active) {
        if (window.confirm(`Are you sure you want to delete ${keys.name} and all the notes in it?`)) {
          const index = selectedText.indexOf(keys);
          selectedText.splice(index, 1);
          break;
        }
      }
    }

    chrome.storage.local.set({ "selectedText": selectedText })
  }

  // renders rename menu on button click
  function renameCategory() {
    for (const key of selectedText) {
      key.rename = false;
      if (key.active) {
        key.rename = true;
      }
    }

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // grabs user input and renames the category
  function submitNewName(e) {
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

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // allow user to add custom notes
  function addCustomNote() {
    for (const keys of selectedText) {
      keys.customNote = false;
      if (keys.active) {
        keys.customNote = true;
      }
      for (const key of keys.note) {
        key.edit = false;
      }
    }

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // add custom note input value to local storage or allow user to edit note
  function submitCustomNote(e) {
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

    chrome.storage.local.set({ "selectedText": selectedText });
    chrome.storage.local.set({ "storedInputValues": storedInputValues });
  }

  // allows user to edit the note
  function editNote(e) {
    for (const keys of selectedText) {
      for (const key of keys.note) {
        key.edit = false;
        // if the edit property is true
        if (keys.active && e.target.id === key.id) {
          keys.customNote = true;
          key.edit = true;

          // add the text and title values to storage
          chrome.storage.local.set({
            "storedNote": {
              id: key.id,
              title: key.title,
              text: key.text,
            }
          });
        }
      }
    }

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // add new category on button click
  function createNewCategory() {
    selectedText.push({
      date: date,
      active: false,
      rename: false,
      customNote: false,
      editNote: false,
      id: self.crypto.randomUUID(),
      name: "New category",
      note: []
    });

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // save users note input values
  function saveUserInput() {
    const titleInput = document.querySelectorAll('input[type="text"]');
    const textInput = document.querySelectorAll('textarea');

    const inputValues = {
      title: '',
      text: '',
    };

    titleInput.forEach(input => inputValues.title = input.value);
    textInput.forEach(input => inputValues.text = input.value);

    chrome.storage.local.set({ "storedInputValues": inputValues });
  }

  // send the updated array back to background.js
  chrome.runtime.sendMessage({ message: selectedText });

  deleteNotesButton.addEventListener('click', deleteCheckedInput);
  deleteCategoryButton.addEventListener('click', deleteCategory);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
  renameButton.addEventListener('click', renameCategory);
  createNewNoteButton.addEventListener('click', addCustomNote);
  renameForm.addEventListener('submit', submitNewName);
  createNewNote.addEventListener('submit', submitCustomNote);
  createNewNote.addEventListener('keyup', saveUserInput);
  noteList.addEventListener('click', editNote);
  newCategoryButton.addEventListener('click', createNewCategory);
})();