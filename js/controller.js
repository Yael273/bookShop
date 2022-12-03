'use strict'

function onInit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    const strHTMLs = books.map(book => `
    <tr>
      <td>${book.id}</td>
      <td>${book.name}</td>
      <td>$${book.price}</td>
      <td>${book.rate}</td>
      <td>
        <button class="read" onclick="onReadBook('${book.id}')">Read</button>
        <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
        <button class="remove" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
    </tr>
    `

    )
    document.querySelector('tbody').innerHTML = strHTMLs.join('')
}

function onAddBook() {
    const name = prompt('Book name?')
    const price = +prompt('Book price?')

    if (name && price) {
        const book = addBook(name, price)
        renderBooks()
        flashMsg(`Book added`)
    }

}

function onReadBook(bookId) {
    //TODO: add image
    saveCurrBookId(bookId)
    var book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    elModal.querySelector('h5').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('p').innerHTML = book.desc
    elModal.classList.add('open')
    // renderBooks()
}
function onUpdateBook(bookId) {
    // if (newName && newPrice && book.name !== newName && book.price !== newPrice) {
    //     const book = updateBook(carId, newSpeed)
    //     renderCars()
    //     flashMsg(`Speed updated to: ${car.maxSpeed}`)
    // }
    updateBook(bookId)
    flashMsg(`Book updated`)
    renderBooks()
}
function onRemoveBook(bookId) {
    removeBook(bookId)
    flashMsg('book deleted')
    renderBooks()

}

function onCloseModal() {
    closeModal()
    renderBooks()
}

function onAddRating(ev) {
    ev.preventDefault()
    addRating()
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSetFilterBy(filterBy) {
    filterBy = setFilterBy(filterBy)
    renderBooks()
    console.log('filterBy:', filterBy)

    const queryStringParams =
        `?name=${filterBy.name}&price=${filterBy.price}`
    const newUrl = window.location.protocol + "//" + window.location.host +
        window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSearch(ev) {
    ev.preventDefault()
    search()
    renderBooks()
}

function onPlusRating() {
    var book = getBookById(gCurrBookId);
    changeBookRate(book, 1);
    document.querySelector('.rate').value = book.rate
}

function onMinRating() {
    var book = getBookById(gCurrBookId);
    changeBookRate(book, -1);
    document.querySelector('.rate').value = book.rate
}