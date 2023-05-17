(async () => {
  const res = await chrome.storage.session.get('selectedText');
  const selectedText = res.selectedText;
  const notesList = document.querySelector(".noteList");
  const categoryList = document.querySelector(".categoryList");
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
    categoryButton.textContent = obj.name;
    categoryButton.type = 'button';

    li.appendChild(categoryButton);
    categoryList.appendChild(li);
  });

  // TODO:
  // i might be able to use reduce to display the total note count

  // display the amount of categories on the popup icon
  await chrome.action.setBadgeText({ text: selectedText.length.toString() });
  await chrome.storage.session.set({ "selectedText": selectedText });
})();
