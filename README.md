# Notersy a note taking chrome extension
# This is the old version of the extension you can check the source code for the new one [here](https://github.com/Exoldarium/notersy-v2)

A small chrome extension that allows users to add, create, update and delete notes, group them in categories. The notes are saved in Chrome's local storage so they can be accesed at any time.

You can get the extension [here](https://chrome.google.com/webstore/detail/notersy/ffpmjnpjajlkfaidlonjegneehmccaja/related) 

## Main Features

- Add notes through the context menu

- Create categories and organize your notes however you wish

- Delete notes and/or categories when you no longer need them

- Create custom notes and format them using the in-built rich text editor

- Edit notes or change their content 

- Your data will persist even if your browser is closed

- Backup/download your notes

## Description:

This was my submission for CS50x final project, although it has been changed considerably since i submited it and became a much bigger application than i originally intended it to be. It will probably change more as i continue to add more features to it and fix bugs that i encounter. 

Considering i spend quite a bit of time online reading and studying i decided to make a small extension that would allow me to grab text from websites and group them in notes that i can access later on. The project was a great way to learn how Chrome extension's work. There were some challenges initially, especially making the extension in a way that is not too intrusive and not requiring too many permissions from the user. 

You can add notes through the context menu, if the text is selected, or you can create new notes directly from popup. Custom categories can be created as well. The popup can only be a single HTML file and in order to make the extension dynamic and react to the user's input i'm reloading the HTML file every time a change happens. Everything is stored in Chrome's local storage so that the extension can show different states depending on what the user is doing. I'm using different boolean values to define which elements are being shown in the popup. For example only one category is active at the time and that category's value will be set to true until the user changes to a new category. All of the notes that the user creates go to the active category. If the user for example wants to edit or create a new note, ```edit``` or ```customNote``` values will be set to ```true```. 

I also created a simple rich text editor that uses ```execCommand()``` method to apply different style's to text so that the user can format their input. The notes can be downloaded as a text file from the options menu as well.

This was the first time i've encountered service-workers and it took some time to learn how to communicate service-worker with other JavaScript files. Chrome docs were a valuable source of information in learning about messaging and how to send data back and forth between different files. 

Design wise, i tried to keep the extension minimalistic as per Chrome's own design style. I will probably update style as i go.

## Technologies used

I'm using vanilla JavaScript, HTML and CSS.
The extension is bundled using [Vite](https://vitejs.dev/) and [CRXJS](https://crxjs.dev/vite-plugin/)

## Setup
Clone this repository.
Run ```npm run dev``` and load dist folder into chrome
