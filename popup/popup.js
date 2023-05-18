(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const renameForm = document.querySelector(".renameCategory");
  console.log({ selectedText });

  // create categories and add data to DOM
  selectedText.map(obj => {
    const categoryItem = document.createElement('li');
    const categoryButton = document.createElement('button');
    const renameButton = document.createElement('button');

    // display only the notes from the category that has been clicked
    if (obj.active) {
      obj.note.map(obj => {
        const url = document.createElement('h2');
        const text = document.createElement('p');
        const notesItem = document.createElement('li');
        const checkbox = document.createElement('input');
        const link = document.createElement('a');

        link.textContent = new URL(obj.url).hostname;
        link.href = obj.url;
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

    categoryButton.id = obj.id;
    categoryButton.textContent = obj.name;
    categoryButton.type = 'button';
    renameButton.id = obj.id;
    renameButton.textContent = 'Set a new name';
    renameButton.type = 'button';

    categoryItem.appendChild(categoryButton);
    categoryItem.appendChild(renameButton);
    categoryList.appendChild(categoryItem);
  });

  // TODO:
  // i might be able to use reduce to display the total note count

  // display the amount of categories on the popup icon
  await chrome.action.setBadgeText({ text: selectedText.length.toString() });
  await chrome.storage.session.set({ "selectedText": selectedText });
})();
