(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const renameForm = document.querySelector(".renameCategory");
  const createNewNote = document.querySelector(".createNewNote");
  const customNoteInput = document.createElement('input');
  const customTitleInput = document.createElement('input');
  const customNoteButton = document.createElement('button');
  console.log({ selectedText });

  // TODO:
  // custom colours for categories, use input type color

  // create categories and add data to DOM
  selectedText.map(obj => {
    const categoryItem = document.createElement('li');
    const categoryButton = document.createElement('button');

    // display only the notes from the category that has been clicked
    if (obj.active) {
      obj.note.map(obj => {
        const url = document.createElement('h2');
        const text = document.createElement('p');
        const notesItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const link = document.createElement('a');

        if (obj.title.length >= 25) {
          link.textContent = obj.title.slice(0, 25) + '...';
        } else {
          link.textContent = obj.title;
        }
        link.href = obj.title;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        text.textContent = obj.text;
        checkbox.type = 'checkbox';
        checkbox.id = obj.text;

        notesItem.appendChild(checkbox);
        url.appendChild(link);
        notesItem.appendChild(url);
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
      confirmButton.textContent = 'T';
      confirmButton.className = 'confirmButton';

      renameForm.appendChild(renameInput);
      renameForm.appendChild(confirmButton);
    }

    // check if the user wants to add a custom note
    if (obj.customNote) {
      customTitleInput.type = 'text';
      customTitleInput.id = obj.id;
      customTitleInput.className = 'titleInput';
      customTitleInput.required = true;
      customTitleInput.placeholder = "Note Title";
      customNoteInput.placeholder = "Note Text";
      customNoteInput.type = 'text';
      customNoteInput.id = obj.id;
      customNoteInput.required = true;
      customNoteInput.className = "textInput";
      customNoteButton.id = obj.id
      customNoteButton.type = 'submit';
      customNoteButton.textContent = 'Add Note';
      customNoteButton.className = 'confirmNoteButton';

      createNewNote.appendChild(customTitleInput);
      createNewNote.appendChild(customNoteButton);
      createNewNote.appendChild(customNoteInput);
    }

    categoryButton.id = obj.id;
    categoryButton.textContent = obj.name;
    categoryButton.type = 'button';

    categoryItem.appendChild(categoryButton);
    categoryList.appendChild(categoryItem);
  });

  // TODO:
  // i might be able to use reduce to display the total note count

  // display the amount of categories on the popup icon
  await chrome.action.setBadgeText({ text: selectedText.length.toString() });
  await chrome.storage.session.set({ "selectedText": selectedText });
})();
