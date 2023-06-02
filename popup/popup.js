(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const storedInputValuesRes = await chrome.storage.local.get('storedInputValues');
  const selectedText = res.selectedText || [];

  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const renameForm = document.querySelector(".renameCategory");
  const createNewNote = document.querySelector(".createNewNote");
  const createNewNoteButton = document.querySelector('.createNewNoteButton');
  const optionsButton = document.querySelector('.optionsButton');
  const deleteNotesButton = document.querySelector(".deleteNotesButton");
  const cancelButton = document.querySelector(".cancelButton");
  const noteTip = document.querySelector('.noteTip');

  const customNoteInput = document.createElement('textarea');
  const customTitleInput = document.createElement('input');
  const customNoteButton = document.createElement('button');

  console.log({ selectedText });
  console.log(storedInputValuesRes);

  // TODO: 
  // remove logs

  // hide create and delete notes button if there are no categories
  if (selectedText.length === 0) {
    createNewNoteButton.style.display = 'none';
    deleteNotesButton.style.display = 'none';
  }

  // create categories and add data to DOM
  selectedText.map(obj => {
    const categoryItem = document.createElement('li');
    const categoryButton = document.createElement('button');
    const categoryTooltip = document.createElement('span');

    // display only the notes from the category that has been clicked
    if (obj.active) {
      categoryButton.style.background = '#96adfc';
      noteTip.style.display = 'none';

      obj.note.map(obj => {
        const url = document.createElement('h2');
        const text = document.createElement('p');
        const notesItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const link = document.createElement('a');
        const div = document.createElement('div');
        const editButton = document.createElement('button');
        const editButtonIcon = document.createElement('i');
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
        text.style = 'white-space: pre-wrap;';
        checkbox.type = 'checkbox';
        checkbox.id = obj.text;
        editButton.id = obj.id;
        editButton.type = 'button';
        editButton.className = 'editButton';
        editButtonIcon.className = 'bi bi-pencil-square'
        editButtonIcon.id = obj.id;
        editButton.style = "font-size: 17px;"
        div.className = 'notesDiv';

        url.appendChild(link);
        div.appendChild(url);
        editButton.appendChild(editButtonIcon);
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
      const confirmButtonStyle = document.createElement('i');

      renameInput.type = 'text';
      confirmButton.type = 'submit';
      confirmButton.className = 'confirmButton';
      confirmButtonStyle.className = "bi bi-check-square";
      cancelButton.style = 'visibility: visible;';

      renameForm.appendChild(renameInput);
      confirmButton.appendChild(confirmButtonStyle);
      renameForm.appendChild(confirmButton);
    }

    // check if the user wants to add a custom note
    if (obj.customNote) {
      const confirmButton = document.createElement('i');

      customTitleInput.type = 'text';
      customTitleInput.id = obj.id;
      customTitleInput.className = 'titleInput';
      customTitleInput.placeholder = "Note Title";
      customNoteInput.id = obj.id;
      customNoteInput.className = "textInput";
      customNoteButton.id = obj.id
      customNoteButton.type = 'submit';
      customNoteButton.className = 'confirmNoteButton';
      confirmButton.className = "bi bi-check-square";
      customNoteInput.style = `height: ${storedInputValuesRes.storedInputValues.height}px;`;
      cancelButton.style = 'visibility: visible;';

      // update input values with saved input values so that the note saves
      customTitleInput.value = storedInputValuesRes.storedInputValues.title;
      customNoteInput.value = storedInputValuesRes.storedInputValues.text;

      createNewNote.appendChild(customTitleInput);
      createNewNote.appendChild(customNoteInput);
      customNoteButton.appendChild(confirmButton);
      createNewNote.appendChild(customNoteButton);
    }

    categoryButton.id = obj.id;
    categoryButton.textContent = obj.name.length > 50 ? obj.name.slice(0, 50) + '...' : obj.name; // truncate category title
    categoryButton.type = 'button';
    categoryButton.className = 'categoryButton';
    categoryTooltip.className = 'tooltiptext';
    categoryTooltip.textContent = obj.name.length > 50 ? obj.name : categoryTooltip.classList.remove('tooltiptext');

    categoryButton.appendChild(categoryTooltip);
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