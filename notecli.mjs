import sqlite3 from 'sqlite3';
import inquirer from 'inquirer';

sqlite3.verbose();

// Initialize the database connection
const db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
}); 
 
// Promisified database functions for cleaner async/await usage
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

// Initialize the notes table if it doesn't exist
const initDB = async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.error('Error initializing the database:', err);
    process.exit(1);
  }
};

// Main loop of the application
const main = async () => {
  try {
    await initDB();
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: ['Add Note', 'View Notes', 'Edit Note', 'Delete Note', 'Search Notes', 'Exit'],
        },
      ]);

      switch (action) {
        case 'Add Note':
          await addNote();
          break;
        case 'View Notes':
          await viewNotes();
          break;
        case 'Edit Note':
          await editNote();
          break;
        case 'Delete Note':
          await deleteNote();
          break;
        case 'Search Notes':
          await searchNotes();
          break;
        case 'Exit':
          console.log('Goodbye!');
          db.close();
          process.exit(0);
          break;
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
};

// Function to add a new note with input validation
const addNote = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the note title:',
      validate: input => input.trim() !== '' || 'Title cannot be empty.',
    },
    {
      type: 'input',
      name: 'content',
      message: 'Enter the note content:',
      validate: input => input.trim() !== '' || 'Content cannot be empty.',
    },
  ]);

  try {
    await run('INSERT INTO notes (title, content) VALUES (?, ?)', [answers.title, answers.content]);
    console.log('Note added successfully!');
  } catch (err) {
    console.error('Error adding note:', err.message);
  }
};

// Function to view all notes
const viewNotes = async () => {
  try {
    const rows = await all('SELECT * FROM notes');
    if (rows.length === 0) {
      console.log('No notes available.');
    } else {
      console.table(rows);
    }
  } catch (err) {
    console.error('Error retrieving notes:', err.message);
  }
};

// Function to search notes
const searchNotes = async () => {
  const { query } = await inquirer.prompt([
    { type: 'input', name: 'query', message: 'Enter search keyword:' },
  ]);
  try {
    const rows = await all('SELECT * FROM notes WHERE title LIKE ? OR content LIKE ?', [`%${query}%`, `%${query}%`]);
    rows.length ? console.table(rows) : console.log('No matching notes found.');
  } catch (err) {
    console.error('Error searching notes:', err.message);
  }
};

// Function to edit an existing note
const editNote = async () => {
  try {
    const rows = await all('SELECT * FROM notes');
    if (rows.length === 0) {
      console.log('No notes available to edit.');
      return;
    }

    const choices = rows.map((note) => ({
      name: `ID: ${note.id} | Title: ${note.title} | Content: ${note.content}`,
      value: note.id,
    }));

    const { noteId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'noteId',
        message: 'Select the note you want to edit:',
        choices,
      },
    ]);

    const selectedNote = rows.find((note) => note.id === noteId);

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the new title:',
        default: selectedNote.title,
        validate: input => input.trim() !== '' || 'Title cannot be empty.',
      },
      {
        type: 'input',
        name: 'content',
        message: 'Enter the new content:',
        default: selectedNote.content,
        validate: input => input.trim() !== '' || 'Content cannot be empty.',
      },
    ]);

    await run('UPDATE notes SET title = ?, content = ? WHERE id = ?', [
      answers.title,
      answers.content,
      noteId,
    ]);
    console.log('Note updated successfully!');
  } catch (err) {
    console.error('Error editing note:', err.message);
  }
};

process.on('exit', () => db.close());
process.on('SIGINT', () => {
  console.log('\nClosing database...');
  db.close(() => process.exit(0));
});

main();
