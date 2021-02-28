const express = require('express');

let books = require('./models/Books');

const app = express();

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

//Get all books
app.get('/api/books', (req, res) => {
    res.json(books);
});

//Get single book
app.get('/api/books/:id', (req, res) => {
    const idParam = parseInt(req.params.id);

    //Check if book exists
    const found = books.some(book => {
        return book.id === idParam
    })

    if(found) {
        res.json(books.filter(book => {
            return book.id === idParam
        }));
    }

    res.status(400).json({ msg: `No book with the id of ${idParam} found`})
});

//Create book
app.post('/api/books/create', (req, res) => {
    let newBook = {
        id: books.length + 1,
        name: req.body.name,
        description: req.body.description,
        noAvailable: 1,
        dateAdded: new Date().toUTCString(),
        dateSold: null
    }

    //Validation
    if(!newBook.name || !newBook.description) {
       return res.status(400).json({ msg: "Please include a name and description"})
    }
    
    books.push(newBook);
    res.json(books);
});

//Update book noAvailable info on request
app.put('/api/books/add/:id', (req, res) => {
    const idParam = parseInt(req.params.id);

    //Check if book exists
    const found = books.some(book => {
        return book.id === idParam
    })

    if(found) {
        books.forEach(book => {
            if(book.id === idParam){
                book.noAvailable += 1;
                return res.json(book);
            }
        })
    }

    res.status(400).json({ msg: `No book with the id of ${idParam} found`})
});

//Update book info on sale
app.put('/api/books/sell/:id', (req, res) => {
    const idParam = parseInt(req.params.id);

    //Check if book exists
    const found = books.some(book => {
        return book.id === idParam
    })

    if(found) {
        books.forEach(book => {
            if(book.id === idParam){
                if(book.noAvailable){
                    book.noAvailable -= 1;
                    book.dateSold.push(new Date().toUTCString());
                    return res.json(book);
                } else {
                    return res.status(400).json({ msg: "Sold out/ no inventory"})
                }

            }
        })
    }

    res.status(400).json({ msg: `No book with the id of ${idParam} found`})
});

//Delete book from system
app.delete('/api/books/remove/:id', (req, res) => {
    const idParam = parseInt(req.params.id);

    //Check if book exists
    const found = books.some(book => {
        return book.id === idParam
    })

    if(found) {
        books = books.filter(book => {
            return book.id !== idParam
        });
        return res.json(books);

    }

    res.status(400).json({ msg: `No book with the id of ${idParam} found`})
});

const PORT = process.env.PORT || 5555;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));