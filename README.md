# Note taker chrome extension

A small chrome extension that allows users to add, create, update and delete notes, group them in categories. The notes are saved in Chrome's local storage so they can be accesed at any time.

## Description:

This is my submission for CS50x final project, although it has been changed considerably since i submited my final project as i continue to add more features and fix some of the bugs that i encounter. 

Considering i spend quite a bit of time online reading and studying i decided to make a small extension that would allow me to grab text from websites and group them in notes that i can access later on. The project was a great way to learn how Chrome extension's work. There were some challenges initially, especially making the extension in a way that is not too intrusive and not requiring too many permissions from the user. 

You can add notes through the context menu, if the text is selected, or you can create new notes directly from popup. Custom categories can be created as well. The popup can only be a single HTML file and in order to make the extension dynamic and react to the user's input i'm reloading the HTML file every time a change happens. Everything is stored in Chrome's local storage so that the extension can show different states depending on what the user is doing. I'm using different boolean values to define which elements are being shown in the popup. For example only one category is active at the time and that category's value will be set to true until the user changes to a new category. All of the notes that the user creates go to the active category. If the user for example wants to edit or create a new note, ```edit``` or ```customNote``` values will be set to ```true```. 

This was the first time i've encountered service-workers and it took some time to learn how to communicate service-worker with other JavaScript files. Chrome docs were a valuable source of information in learning about messaging and how to send data back and forth between different files. 

Design wise, i tried to keep the extension minimalistic as per Chrome's own design style. I will probably update style as i go.

## TODO
  - Testing
  - Additional styling
  - Deployment

## Technologies used

I'm using vanilla JavaScript, HTML and CSS.
