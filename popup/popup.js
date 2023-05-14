(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const deleteButton = document.querySelector(".deleteButton");
  const selectedText = res.selectedText;
  console.log({ selectedText });

  // create categories and add data to DOM
  selectedText.map(obj => {
    const li = document.createElement('li');
    const categoryButton = document.createElement('button');

    categoryButton.textContent = obj.name;
    categoryButton.type = 'button';

    li.appendChild(categoryButton);
    categoryList.appendChild(li);
  });

  // TODO:
  // categories should be displayed in a row, on click the menu should go to top and display a column

  let counter = 0;
  function displayNotesOnCategoryClick(e) {
    // track how many times the button has been clicked, we don't want to duplicate notes
    counter += 1;
    if (counter > 1) {
      return;
    }

    // add notes to DOM on click
    for (const key of selectedText) {
      if (e.target.textContent === key.name) {
        key.note.map(obj => {
          const url = document.createElement('h2');
          const text = document.createElement('p');
          const li = document.createElement('li');
          const input = document.createElement('input');
          const link = document.createElement('a');

          link.textContent = new URL(obj.url).hostname;
          link.href = obj.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          text.textContent = obj.text;
          input.type = 'checkbox';
          input.id = obj.text;

          li.appendChild(input);
          url.appendChild(link);
          li.appendChild(url);
          li.appendChild(text);
          notesList.appendChild(li);
        });
      }
    }
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
    // reload popup on successful delete
    location.reload();
  }
  // display the amount of categories on the popup icon
  await chrome.action.setBadgeText({ text: selectedText.length.toString() });

  deleteButton.addEventListener('click', deleteCheckedInput);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
})();
