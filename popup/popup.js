const ul = document.querySelector(".noteList");
const deleteButton = document.querySelector(".deleteButton");

// get selected text from local storage and add it to HTML
chrome.storage.local.get('selectedText', (popupText) => {
  const selectedText = popupText.selectedText;

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

  function checkInput() {
    const input = document.querySelectorAll('input[type="checkbox"]');
    input.forEach(input => {
      if (input.checked === true) {
        for (const key of selectedText) {
          if (key.text === input.id) {
            const index = selectedText.indexOf(key);
            selectedText.splice(index, 1);
            console.log(index);
            chrome.storage.local.set({ "selectedText": selectedText });
          }
        }
      }
    })
    // console.log(input);
  }

  deleteButton.addEventListener('click', checkInput);
  console.log({ popupText });
});


// console.log(ul);
