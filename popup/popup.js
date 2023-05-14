// // get selected text from session storage
// (async () => {
//   const res = await chrome.storage.session.get('selectedText');
//   const ul = document.querySelector(".noteList");
//   const deleteButton = document.querySelector(".deleteButton");
//   const selectedText = res.selectedText;
//   console.log({ selectedText });

//   // create elements and add data to html
//   selectedText.map(obj => {
//     const url = document.createElement('h2');
//     const text = document.createElement('p');
//     const li = document.createElement('li');
//     const input = document.createElement('input');
//     const link = document.createElement('a');
//     const categoryButton = document.createElement('a');

//     // link.textContent = new URL(obj.url).hostname;
//     // link.href = obj.url;
//     // link.target = "_blank";
//     // link.rel = "noopener noreferrer";
//     // text.textContent = obj.text;
//     // input.type = 'checkbox';
//     // input.id = obj.text;

//     // li.appendChild(input);
//     // url.appendChild(link);
//     // li.appendChild(url);
//     categoryButton.textContent = obj.name;
//     categoryButton.href = 'popup/notes.html';
//     // categoryButton.className = 'category';

//     li.appendChild(categoryButton);
//     ul.appendChild(li);
//   });

//   function categoryClick(e) {
//     // const category = document.querySelectorAll('.category');
//     console.log(e.target.textContent);
//     for (const key of selectedText) {
//       if (e.target.textContent === key.name) {
//         window.location = 'notes.html';
//         key.note.map(obj => {
//           const url = document.createElement('h2');
//           const text = document.createElement('p');
//           const li = document.createElement('li');
//           const input = document.createElement('input');
//           const link = document.createElement('a');

//           link.textContent = new URL(obj.url).hostname;
//           link.href = obj.url;
//           link.target = "_blank";
//           link.rel = "noopener noreferrer";
//           text.textContent = obj.text;
//           input.type = 'checkbox';
//           input.id = obj.text;

//           li.appendChild(input);
//           url.appendChild(link);
//           li.appendChild(url);
//           li.appendChild(text);
//           ul.appendChild(li);
//         });
//       }
//     }
//   }

//   // delete selected notes
//   function checkInput() {
//     const input = document.querySelectorAll('input[type="checkbox"]');
//     input.forEach(input => {
//       // check if input is checked
//       if (input.checked) {
//         for (const key of selectedText) {
//           // if the text content of the key matches selected input id (i'm using note text as id)
//           if (key.text === input.id) {
//             // remove that key
//             const index = selectedText.indexOf(key);
//             selectedText.splice(index, 1);
//           }
//         }
//       }
//     });

//     // update session storage
//     chrome.storage.session.set({ "selectedText": selectedText });
//     // send message to background.js with the new storage data
//     chrome.runtime.sendMessage({ message: selectedText });
//     // reload popup on successful delete
//     location.reload();
//   }
//   // display the amount of notes on the popup icon
//   await chrome.action.setBadgeText({ text: selectedText.length.toString() });
//   deleteButton.addEventListener('click', checkInput);
//   ul.addEventListener('click', categoryClick);
// })();
