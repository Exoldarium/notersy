(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const storedNoteRes = await chrome.storage.local.get('storedNote');
  const selectedText = res.selectedText || [];

  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const renameForm = document.querySelector(".renameCategory");
  const createNewNote = document.querySelector(".createNewNote");
  const createNewNoteButton = document.querySelector('.createNewNoteButton');
  const optionsButton = document.querySelector('.optionsButton');

  const customNoteInput = document.createElement('textarea');
  const customTitleInput = document.createElement('input');
  const customNoteButton = document.createElement('button');
  console.log({ selectedText });

  if (selectedText.length === 0) {
    createNewNoteButton.style.display = 'none';
  }

  // create categories and add data to DOM
  selectedText.map(obj => {
    const categoryItem = document.createElement('li');
    const categoryButton = document.createElement('button');

    // display only the notes from the category that has been clicked
    if (obj.active) {
      categoryButton.style.background = '#96adfc';

      obj.note.map(obj => {
        const url = document.createElement('h2');
        const text = document.createElement('p');
        const notesItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const link = document.createElement('a');
        const div = document.createElement('div');
        const editButton = document.createElement('button');
        const regex = /^((http|https|ftp):\/\/)/;

        // check if title is url or just a normal string
        if (regex.test(obj.title)) {
          link.textContent = new URL(obj.title).hostname;
          link.href = obj.title;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        if (!regex.test(obj.title)) {
          link.textContent = obj.title;
        }

        text.textContent = obj.text;
        checkbox.type = 'checkbox';
        checkbox.id = obj.text;
        editButton.textContent = 'Edit';
        editButton.id = obj.id;
        editButton.className = 'editButton';

        url.appendChild(link);
        div.appendChild(url);
        div.appendChild(editButton);
        div.appendChild(checkbox)
        notesItem.appendChild(div);
        notesItem.appendChild(text);
        notesList.appendChild(notesItem);
      });
    }


    // check if the rename property is true, if it is allow user to rename category
    if (obj.rename) {
      const renameInput = document.createElement('input');
      const confirmButton = document.createElement('button');

      renameInput.type = 'text';
      confirmButton.type = 'submit';
      confirmButton.textContent = 'Confirm';
      confirmButton.className = 'confirmButton';

      renameForm.appendChild(renameInput);
      renameForm.appendChild(confirmButton);
    }

    // check if the user wants to add a custom note
    if (obj.customNote) {
      customTitleInput.type = 'text';
      customTitleInput.id = obj.id;
      customTitleInput.className = 'titleInput';
      customTitleInput.placeholder = "Note Title";
      customNoteInput.id = obj.id;
      customNoteInput.className = "textInput";
      customNoteButton.id = obj.id
      customNoteButton.type = 'submit';
      customNoteButton.textContent = 'Add';
      customNoteButton.className = 'confirmNoteButton';

      createNewNote.appendChild(customTitleInput);
      createNewNote.appendChild(customNoteInput);
      createNewNote.appendChild(customNoteButton);
    }

    // grab values from storage if edit property is true and add them to input and textarea
    for (const key of obj.note) {
      if (key.edit) {
        customTitleInput.value = storedNoteRes.storedNote.title;
        customNoteInput.value = storedNoteRes.storedNote.text;
      }
    }

    categoryButton.id = obj.id;
    categoryButton.textContent = obj.name;
    categoryButton.type = 'button';
    categoryButton.className = 'categoryButton';

    categoryItem.appendChild(categoryButton);
    categoryList.appendChild(categoryItem);
  });

  // go to options page on button click
  function goToOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options/options.html'));
    }
  }

  // get the total amount of all notes
  const values = Object.values(selectedText);
  const amount = values.reduce((tally, currentValue) => tally + currentValue.note.length, 0);

  // display the amount of categories on the popup icon
  chrome.action.setBadgeText({ text: amount.toString() });
  chrome.storage.local.set({ "selectedText": selectedText });

  optionsButton.addEventListener('click', goToOptionsPage);
})();
