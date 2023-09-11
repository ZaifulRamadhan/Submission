const books = [];
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const BOOK_ITEMID = "itemId";

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

document.addEventListener(RENDER_EVENT,function(){
  console.log(books);
})

 document.getElementById('searchBook').addEventListener("submit", function (event){
   event.preventDefault();
   const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
   const bookList = document.querySelectorAll('.book_item > h3');
       for (buku of bookList) {
       if (buku.innerText.toLowerCase().includes(searchBook)) {

       buku.parentElement.style.display = "none";
     } else {
       buku.parentElement.style.display = "block";
     }
   }
 })

function findBookIndex(bookId) {
  for (const index in books) {
      if (books[index].id === bookId) {
          return index;
      }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function makeBook(submitBookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = submitBookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = submitBookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = submitBookObject.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute(
      "id",
      `book-${submitBookObject.id}`
  );
  const btnAct = document.createElement("div");

  btnAct.classList.add("action");

  if (submitBookObject.isCompleted) {
      const belumDibaca = document.createElement("button");

      belumDibaca.classList.add("green");

      belumDibaca.innerText = "Belum dibaca";

      belumDibaca.addEventListener("click", function () {
          undoBookFromCompleted(submitBookObject.id);
      });

      const deleteBook = document.createElement("button");

      deleteBook.innerText = "Hapus buku";

      deleteBook.classList.add("red");

      deleteBook.addEventListener("click", function () {
          removeBookFromCompleted(submitBookObject.id);
      });

      btnAct.append(belumDibaca, deleteBook);
  } else {
      const sudahDibaca = document.createElement("button");

      sudahDibaca.innerText = "Selesai dibaca";

      sudahDibaca.classList.add("green");

      sudahDibaca.addEventListener("click", function () {
          addBookToCompleted(submitBookObject.id);
      });

      const trashButton = document.createElement("button");

      trashButton.innerText = "Belum Selesai Dibaca";

      trashButton.classList.add("red");

      trashButton.addEventListener("click", function () {
          undoBookFromCompleted(submitBookObject.id);
      });

      btnAct.append(sudahDibaca, trashButton);
  }

  container.append(btnAct);

  return container;
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generatedId = generateId();
  const submitBookObject = generateBookObject(
      generatedId,
      bookTitle,
      bookAuthor,
      bookYear,
      isCompleted
  );

  books.push(submitBookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

 function addBookToCompleted(bookId) {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }

 function removeBookFromCompleted(bookId) {
   const bookTarget = findBookIndex(bookId);

   if (bookTarget === -1) return;

   books.splice(bookTarget, 1);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }

 function undoBookFromCompleted(bookId) {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  });

  if (isStorageExist()) {
      loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  uncompletedBOOKList.innerHTML = '';
  const listCompleted = document.getElementById('completeBookshelfList'); 
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isCompleted) {
          listCompleted.append(bookElement);
      } else {
          uncompletedBOOKList.append(bookElement);
      }
  }
});