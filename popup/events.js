(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const categoryList = document.querySelector(".categoryList");
  const deleteButton = document.querySelector(".deleteButton");

  // TODO:
  // we could use the active property in renaming categories
  // the clicked category becomes active and a button appears on reload that will allow user to input a new name
  // if active then create.element, create the input that will be used to change the name
  // it should also display a confirm or cancel button
  // inputing a new name and confirming should reload again 

  // TODO:
  // adding custom notes could be done separately, through the popup, not through context menu
  // custom notes can only be added to already created categories
  // when the category is clicked the button should appear to create a new note
  // when the button is clicked a textbox is created and the popup is reloaded
  // the user can input the note in the textbox and when finished confirms the text, reload the popup again to display the note
  // these custom notes could be saved under a separate name in storage

  // track how many times the button has been clicked, we don't want to duplicate notes
  let counter = 0;
  async function displayNotesOnCategoryClick(e) {
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
      console.log(e.target.id);
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
    // send message to background.js with the new storage data
    await chrome.runtime.sendMessage({ message: selectedText });
    // rerender popup on successful delete
    location.reload();
  }

  deleteButton.addEventListener('click', deleteCheckedInput);
  categoryList.addEventListener('click', displayNotesOnCategoryClick);
})();