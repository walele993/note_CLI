import sqlite3 from 'sqlite3';
import inquirer from 'inquirer';

const db = new sqlite3.Database('./notes.db');

// Crea la tabella se non esiste
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);
});

const main = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Add Note', 'View Notes', 'Delete Note', 'Exit'],
      },
    ])
    .then((answers) => {
      const action = answers.action;

      switch (action) {
        case 'Add Note':
          addNote();
          break;
        case 'View Notes':
          viewNotes();
          break;
        case 'Delete Note':
          deleteNote();
          break;
        case 'Exit':
          db.close();
          console.log('Goodbye!');
          break;
      }
    });
};

const addNote = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the note:',
      },
      {
        type: 'input',
        name: 'content',
        message: 'Enter the content of the note:',
      },
    ])
    .then((answers) => {
      const { title, content } = answers;
      db.run('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) {
          console.error('Error adding note:', err.message);
        } else {
          console.log('Note added successfully!');
        }
        main();
      });
    });
};

const viewNotes = () => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      console.log('No notes available.');
    } else {
      console.log('\nNotes:');
      rows.forEach((row) => {
        console.log(`ID: ${row.id} | Title: ${row.title} | Content: ${row.content}`);
      });
    }
    main();
  });
};

const deleteNote = () => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      console.log('No notes available to delete.');
      main();
      return;
    }

    const noteChoices = rows.map((row) => ({
      name: `${row.title} - ${row.content}`,
      value: row.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'noteId',
          message: 'Select the note you want to delete:',
          choices: noteChoices,
        },
      ])
      .then((answers) => {
        const { noteId } = answers;
        db.run('DELETE FROM notes WHERE id = ?', [noteId], (err) => {
          if (err) {
            console.error('Error deleting note:', err.message);
          } else {
            console.log('Note deleted successfully!');
          }
          main();
        });
      });
  });
};

// Avvia l'app
main();
