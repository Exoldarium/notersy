// get selected text from local storage
(async () => {
  const res = await chrome.storage.local.get('selectedText');
  const ul = document.querySelector(".noteList");
  const deleteButton = document.querySelector(".deleteButton");
  const selectedText = res.selectedText;

  // create elements and add data to html
  selectedText.map(obj => {
    const url = document.createElement('h2');
    const text = document.createElement('p');
    const li = document.createElement('li');
    const input = document.createElement('input');

    url.textContent = obj.url;
    text.textContent = obj.text;
    input.type = 'checkbox';
    input.id = obj.text;

    li.appendChild(url);
    li.appendChild(text);
    li.appendChild(input);
    ul.appendChild(li);
  });

  // delete selected notes
  function checkInput() {
    const input = document.querySelectorAll('input[type="checkbox"]');
    input.forEach(input => {
      // check which input is checked
      if (input.checked === true) {
        for (const key of selectedText) {
          // if the text content of the key matches selected input id (i'm using text as id)
          if (key.text === input.id) {
            // remove that key
            const index = selectedText.indexOf(key);
            selectedText.splice(index, 1);
          }
        }
      }
    });
    // update local storage
    chrome.storage.local.set({ "selectedText": selectedText });
    // send message to background.js with the new storage data
    chrome.runtime.sendMessage({ message: selectedText });
  }

  deleteButton.addEventListener('click', checkInput);
})();
