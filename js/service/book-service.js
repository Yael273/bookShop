'use strict'

const STORAGE_KEY = 'bookDB'
const gNames = ['The silverlining playbook', 'The great gatsby', 'The alchemist', 'Stranger to the ground']
const PAGE_SIZE = 5

var gCurrBookId
var gPageIdx = 0
var gBooks
var gBooks = [
    _createBook('The silverlining playbook', 60),
    _createBook('Stranger to the ground', 100),
    _createBook('The great gatsby', 89)
]

var gFilterBy = {
    all: '',
    maxPrice: 0,
    minRate: 10
}

function setFilterBy(filterBy) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy
    if (filterBy.maxPrice === filterBy) getMaxPrice()
    return gFilterBy
}

_createBooks()

function getBooks() {
    const books = gBooks.filter(book => book.name.includes(gFilterBy.all))
    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBookById(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    return book
}

function _createBook(name, price, rate = 0, imgUrl) {
    return {
        id: makeId(),
        name,
        price: price.toFixed(2),
        desc: makeLorem(),
        rate: rate,
        imgUrl: `<img src="img/book.jpg" alt="book cover" />`
    }

}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 3; i++) {
            var name = gNames[getRandomIntInclusive(0, gNames.length - 1)]
            books.push(_createBook(name))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


function removeBook(bookId) {
    const idx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
    const book = getBookById(bookId)
    book.price = bookPrice
    const newName = prompt('Enter book name', book.name)
    const newPrice = +prompt('Enter book price', book.price)

    book.name = newName
    book.price = newPrice.toFixed(2)
    _saveBooksToStorage()

}

function closeModal() {
    document.querySelector('.modal').classList.remove('open')
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
    // if (gPageIdx * PAGE_SIZE === gBooks.length) {
    //     document.querySelector('.nextPage').innerHTML = `<button disabled onclick="onNextPage()">Next Page</button>`
    // }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
    // if (gPageIdx * PAGE_SIZE <= gBooks.length) {
    //     document.querySelector('.nextPage').innerHTML = `<button disabled onclick="onNextPage()">Next Page</button>`
    // }
}

function search() {

    const elSearch = document.querySelector('input[name="search"]')
    const search = elSearch.value
    if (!search) gBooks = loadFromStorage(STORAGE_KEY)
    else gBooks = gBooks.filter(book => book.name === search)
}


function saveCurrBookId(bookId){
    gCurrBookId = bookId
}

function changeBookRate(book, val){
    if ((book.rate <= 0 && val < 0) || (book.rate >= 10 && val > 0)) return;
    book.rate += val;
    saveToStorage(STORAGE_KEY, gBooks);
}

function getMaxPrice(){
    for (price in gBooks){
        if (gFilterBy.maxPrice < price) gFilterBy.maxPrice = price
    }
}