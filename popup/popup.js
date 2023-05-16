(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
  const deleteButton = document.querySelector(".deleteButton");
  const newCategory = document.querySelector(".newCategoryButton");
  const selectedText = res.selectedText;
  console.log({ selectedText });

  // create categories and add data to DOM
  selectedText.map(obj => {
    const li = document.createElement('li');
    const categoryButton = document.createElement('button');

    // display only the notes from the category that has been clicked
    if (obj.active) {
      obj.note.map(obj => {
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

    categoryButton.id = obj.id;
    categoryButton.textContent = obj.date;
    categoryButton.type = 'button';

    li.appendChild(categoryButton);
    categoryList.appendChild(li);
  });

  // track how many times the button has been clicked, we don't want to duplicate notes
  let counter = 0;
  async function displayNotesOnCategoryClick(e) {
    console.log(e.target);
    if (counter >= 1) {
      return;
    }

    // if the category is clicked set active to true, if not set it to false
    for (const key of selectedText) {
      key.active = false;
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

  // TODO:
  // try moving all the events into a separate file

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
    // rerender popup on successful delete
    location.reload();
  }

  // TODO:
  // i might be able to use reduce to display the total note count

  // display the amount of categories on the popup icon
  await chrome.action.setBadgeText({ text: selectedText.length.toString() });
  await chrome.storage.session.set({ "selectedText": selectedText });

  deleteButton.addEventListener('click', deleteCheckedInput);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
})();
