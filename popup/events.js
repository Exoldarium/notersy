(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const storedInputValuesRes = await chrome.storage.local.get('storedInputValues');
  const storedInputValues = storedInputValuesRes.storedInputValues;
  const selectedText = res.selectedText || [];

  const date = new Date().toString().slice(0, 15);

  const categoryList = document.querySelector(".categoryList");
  const deleteNotesButton = document.querySelector(".deleteNotesButton");
  const deleteCategoryButton = document.querySelector(".deleteCategoryButton");
  const renameForm = document.querySelector(".renameCategory");
  const renameButton = document.querySelector('.renameButton');
  const createNewNote = document.querySelector('.createNewNote');
  const createNewNoteButton = document.querySelector('.createNewNoteButton');
  const noteList = document.querySelector('.noteList');
  const newCategoryButton = document.querySelector('.createNewCategory');
  const cancelButton = document.querySelector('.cancelButton');
  const textEditDiv = document.querySelector('.customizeTextButton');

  // TODO:
  // add a color picker but limit it to only some optimizied colors that won't clash with the design
  // TODO: 
  // text and paragraph formatting
  // TODO:
  // try to see if we can remove window.confirm from delete category and add custom menu like in options
  // TODO:
  // try using div contenteditable instead of textarea, instead of text area value we could access divs textcontent?
  // https://stackoverflow.com/questions/60581285/execcommand-is-now-obsolete-whats-the-alternative

  // rerender the html every time storage changes
  chrome.storage.onChanged.addListener((change) => {
    if (change.selectedText || change.storedNote) {
      location.reload();
    }
  });

  // show only notes from the currently active category
  function displayNotesOnCategoryClick(e) {
    // if the category is clicked set active to true, if not set it to false
    for (const key of selectedText) {
      key.active = false;
      key.rename = false;
      key.customNote = false;

      if (e.target.id === key.id) {
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

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // deletes active category
  async function deleteCategory() {
    for (const keys of selectedText) {
      const nameCheck = keys.name.length > 50 ? keys.name.slice(0, 50) + '...' : keys.name;
      if (keys.active) {
        if (window.confirm(`Are you sure you want to delete ${nameCheck} and all the notes in it?`)) {
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
    chrome.storage.local.set({ "storedInputValues": storedInputValues });
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
          text: textInput.innerText,
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
          key.text = textInput.innerText;
          keys.customNote = false;
          key.edit = false;
          keys.note.pop();
        }
      }
    }

    storedInputValues.title = '';
    storedInputValues.text = '';

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
            "storedInputValues": {
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

  // save users note input values and text area height
  function saveUserInput() {
    const titleInput = document.querySelector('input[type="text"]');
    const textInput = document.querySelector('.textInput');

    // console.log(textInput.children);

    chrome.storage.local.set({
      "storedInputValues": {
        title: titleInput.value,
        text: textInput.innerText,
      }
    });
  }

  // closes all active inputs
  function closeInputs(e) {
    for (const key of selectedText) {
      if (e.target) {
        key.rename = false;
        key.customNote = false;
      }
    }

    chrome.storage.local.set({ "selectedText": selectedText });
  }

  // allows user to customize text
  function customizeText(e) {
    const button = document.querySelectorAll('button');

    button.forEach(button => {
      if (button.name === 'bold') {
        document.execCommand('bold', false, null);
      }
      if (button.name === 'italic') {
        document.execCommand('italic', false, null);
      }
      if (button.name === 'underline') {
        document.execCommand('underline', false, null);
      }
    })
    console.log(e.target);
    // execCommand is deprecated but it's the only way to create a custom text editor for now
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
  cancelButton.addEventListener('click', closeInputs);
  textEditDiv.addEventListener('click', customizeText);
})();