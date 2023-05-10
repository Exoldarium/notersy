const ul = document.querySelector(".noteList");
const deleteButton = document.querySelector(".deleteButton");

// get selected text from local storage and add it to HTML
chrome.storage.local.get('selectedText', (text) => {
  const selectedText = text.selectedText;

  selectedText.map(obj => {
    const url = document.createElement('h2');
    const text = document.createElement('p');
    const li = document.createElement('li');
    const input = document.createElement('input');

    url.textContent = obj.url;
    text.textContent = obj.text;
    input.type = 'checkbox';
    input.id = obj.id;

    li.appendChild(url);
    li.appendChild(text);
    li.appendChild(input);
    ul.appendChild(li);
  });
  console.log(selectedText);
});

function checkInput() {
  const input = document.querySelectorAll('input[type="checkbox"]');
  // if (input.checked) {

  // }
  console.log(input);
}

deleteButton.addEventListener('click', checkInput);

console.log(ul);
