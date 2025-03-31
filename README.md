# 📝 NoteCLI - The Ultimate CLI Note Taker

*Effortlessly manage your notes from the terminal with a simple and powerful CLI tool*

---

## 🚀 Introduction

**NoteCLI** is a lightweight, yet powerful, command-line note-taking app built with Node.js. It allows you to add, view, modify, and delete notes directly from the terminal, without distractions. Perfect for developers, writers, or anyone who loves working with their terminal. It's simple, fast, and doesn’t require an internet connection or complex setups!

### Key Features:  
- 📝 **Add Notes**: Create notes with a title and content in seconds  
- 📚 **View Notes**: Easily view all your saved notes with a clear format  
- ✏️ **Edit Notes**: Quickly modify your existing notes  
- 🗑️ **Delete Notes**: Remove notes with a simple command  
- 💾 **Local Storage**: All your notes are stored locally in a lightweight SQLite database  
- ⚡ **Fast & Lightweight**: A no-fuss, minimalistic note-taking experience

---

## 📦 Installation  

Simply clone this repository and run it:

1. Clone the repository:

```bash
git clone https://github.com/your-username/notecli.git
```

2. Navigate to the project directory:

```bash
cd notecli
```

3. Install the required dependencies:

```bash
npm install
```

4. Run the app:

```bash
node notecli.mjs
```

---

## 💻 Usage  

Once the app is running, you will be prompted with several options:

- **Add Note**: Enter the title and content of your note, and it will be saved to your database.  
- **View Notes**: See a list of all your notes, along with their IDs, titles, and content.  
- **Edit Note**: Modify a note by specifying the note’s ID.  
- **Delete Note**: Delete a note by specifying the note’s ID.  
- **Exit**: Close the application and return to your terminal.

---

## 🔧 How It Works  

1. **SQLite Database**:  
   - Notes are stored in an SQLite database (`notes.db`), which is automatically created if it doesn't exist.  
   - Each note contains an `ID`, `title`, and `content`.

2. **Simple CLI Prompts**:  
   - **Inquirer.js** is used to guide you through adding, viewing, editing, or deleting notes with simple prompts.

3. **CRUD Operations**:  
   - The application provides full support for **Create**, **Read**, **Update**, and **Delete** operations, making note management simple and efficient.

---

## ⚙️ Configuration Details  

### `Note` Model  
| Property     | Type     | Description                              |
|--------------|----------|------------------------------------------|
| `id`         | integer  | Unique identifier for the note           |
| `title`      | string   | Title of the note                       |
| `content`    | string   | Content of the note                     |

---

## 📈 Analytics  

Although **NoteCLI** doesn’t include analytics by default, it’s built to be lightweight and fast. You can extend the app with custom functionality like exporting notes, organizing notes by categories, or adding reminders!

---

## 🛡️ Requirements  

- Node.js `>=16.0`  
- SQLite3 (installed automatically when you run `npm install`)  

---

## 🤝 Contributing  

Contributions are welcome! If you have suggestions, bug fixes, or new features, feel free to:

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/notecli.git
   ```
3. Create a **feature branch**:
   ```bash
   git checkout -b feature-new-functionality
   ```
4. Commit changes and **push**
5. Open a **pull request**

---

## 🌟 Credits  

This project was created by Gabriele Meucci.

---

*Make your note-taking experience fast, simple, and effective with **NoteCLI**! 📝*
