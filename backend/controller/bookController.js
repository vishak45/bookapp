const Book = require('../model/bookModel');
const readListModel=require('../model/readList');

const getBooks = async (req, res) => {
  try {
    // Parse page and limit from query params
    const page = parseInt(req.query.page) || 1;       // default page 1
    const limit = parseInt(req.query.limit) || 20;    // default 20 books per page
    const skip = (page - 1) * limit;

    // Fetch books with pagination
    const books = await Book.find().skip(skip).limit(limit);

    // Count total books for pagination info
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('❌ Error in getBooks:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// AUTO FETCH: Fetch books from Open Library and store in DB
const storeBooks = async () => {
   const bookCount = await Book.countDocuments();

        if (bookCount >= 8000) {
            console.log('✅ Skipping fetch: Already have 8000+ books in the database.');
            return;
        }
    try {
        console.log('📚 Fetching books from Open Library...');
       const subjects = [
      'science_fiction', 'fantasy', 'romance', 'horror', 'mystery',
      'thriller', 'action', 'adventure', 'biography', 'history',
      'comics', 'drama'
    ];

        for (const subject of subjects) {
            const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=500`);
            const data = await response.json();

            if (data.works && data.works.length > 0) {
                for (const work of data.works) {
                    // Only store books with a valid cover image
                    if (!work.cover_id) continue;

                    const existingBook = await Book.findOne({ openLibraryId: work.key });
                    if (!existingBook) {
                        // Fetch detailed work info for summary
                        let summary = 'No summary available';
                        try {
                            const detailRes = await fetch(`https://openlibrary.org${work.key}.json`);
                            const detailData = await detailRes.json();
                            if (detailData.description) {
                                summary = typeof detailData.description === 'string'
                                    ? detailData.description
                                    : detailData.description.value;
                            }
                        } catch (err) {
                            console.warn(`⚠️ Could not fetch summary for ${work.title}`);
                        }

                        const newBook = new Book({
                            openLibraryId: work.key,
                            title: work.title,
                            authors: work.authors.map(author => author.name),
                            coverImage: `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`,
                            subject: subject,
                            summary: summary // ✅ save the summary
                        });
                        await newBook.save();
                    }
                }
            }
        }
        console.log('✅ Books fetched and stored successfully!');
    } catch (error) {
        console.error('❌ Error fetching books:', error);
    }
};
const specificBook=async(req,res)=>{
    try{
        const bid=req.params.bid;
    const book=await Book.findById(bid);
    if(book)
    {
        res.status(200).json(book);
    }
    else
    {
        res.status(404).json({message:"Book not found"});
    }
    
    
}
catch(error)
    {
        console.log(error);
    }
};
const getBookByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;
        const books = await Book.find({ subject: genre });
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const addReview=async(req,res)=>{
    try{
        const bid=req.params.bid;
        const review=req.body;
        const book=await Book.findById(bid);
        if(book)
        {
            book.reviews.push(review);
            await book.save();
            const addedReview = book.reviews[book.reviews.length - 1]; // last one
      res.status(200).json(addedReview);
        }
        else
        {
            res.status(404).json({message:"Book not found"});
        }
    }
    catch(error)
    {
        console.log(error);
    }
}
const mongoose = require("mongoose");

const addToReadList = async (req, res) => {
  try {
    const userid = req.user.id;
    const bid = req.params.bid;

    const book = await Book.findById(bid);
    if (!book) {
      return res.status(404).json({ message: "❌ Book not found" });
    }

    const readlist = await readListModel.findOne({ userid });

    const bookData = {
      bookid: book._id,
      title: book.title,
      authors: book.authors,
      
      
      coverImage: book.coverImage,
      subject: book.subject,
      
    };

    if (!readlist) {
      // Create new readlist
      const newList = new readListModel({
        userid,
        bookInfo: [bookData],
      });
      await newList.save();
      return res.status(200).json({ message: "✅ Book added to readlist successfully" });
    } else {
      // Check if already exists
      const alreadyExists = readlist.bookInfo.some(
        (b) => b.bookid.toString() === bid
      );
      if (alreadyExists) {
        return res.status(400).json({ message: "⚠️ Book already in readlist" });
      }

      readlist.bookInfo.push(bookData);
      await readlist.save();
      return res.status(200).json({ message: "✅ Book added to readlist successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "❌ Internal Server Error" });
  }
};


const deleteFromReadList = async (req, res) => {
  try {
    const userid = req.user.id; // From auth middleware
    const bid = req.params.bid; // This is the actual book's ObjectId (bookid)

    const readlist = await readListModel.findOne({ userid });
    if (!readlist) {
      return res.status(404).json({ message: "❌ Readlist not found" });
    }

    const originalLength = readlist.bookInfo.length;

    // Filter out the book by matching the bookid field inside bookInfo
    readlist.bookInfo = readlist.bookInfo.filter(
      (book) => book.bookid.toString() !== bid
    );

    // Check if a book was actually removed
    if (readlist.bookInfo.length === originalLength) {
      return res.status(400).json({ message: "⚠️ Book not found in readlist" });
    }

    await readlist.save();
    res.status(200).json({ message: "✅ Book deleted from readlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
};

const getAllReadList = async (req, res) => {
  try {
    const userid = req.user.id;

    const readlist = await readListModel.findOne({ userid }); 
    if (!readlist) {
      return res.status(404).json({ message: "Readlist not found" });
    }

    // Send only the array of books, not the whole document
    res.status(200).json(readlist.bookInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkList = async (req, res) => {
  try {
    const bid = req.params.bid;
    const user = req.user;

    // Check if book exists
    const book = await Book.findById(bid);
    if (!book) {
      return res.status(404).json({ message: "❌ Book not found" });
    }

    // Find user's readlist
    const readlist = await readListModel.findOne({ userid: user.id });

    // If user doesn't have a readlist at all
    if (!readlist || !readlist.bookInfo || readlist.bookInfo.length === 0) {
      return res.status(200).json({ message: "📘 Book not in readlist" });
    }

    // Check if book is in the list
    const isPresent = readlist.bookInfo.some(
      (b) => b.bookid.toString() === bid
    );

    if (isPresent) {
      return res.status(200).json({ message: "Book already in readlist" });
    } else {
      return res.status(200).json({ message: "📘 Book not in readlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
};

const reviewDelete = async (req, res) => {
  try {
    const bid = req.params.bid; // Book ID
    const rid = req.params.rid; // Review ID

    const book = await Book.findById(bid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const initialLength = book.reviews.length;

    book.reviews = book.reviews.filter((rev) => rev._id.toString() !== rid);

    if (book.reviews.length === initialLength) {
      return res.status(404).json({ message: "Review not found" });
    }

    await book.save();
    res.status(200).json({ message: "✅ Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
};
const fetchBooksByReview = async (req, res) => {
  try {
    const userid = req.user.id;

    // Find books where at least one review has userid == current user
    const books = await Book.find({ 'reviews.userid': userid });

const reviews = [];
books.forEach(book => {
  book.reviews.forEach(review => {
    if (review.userid.toString() === userid) {
      reviews.push({
        _id: review._id,
        bookid: book._id,
        title: book.title,
        coverImage: book.coverImage,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAT
      });
    }
  });
});

res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const limit = parseInt(req.query.limit) || 20;
    const excludeId = req.query.excludeId;

    const filter = { subject: genre };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const books = await Book.find(filter).limit(limit);

    res.status(200).json(books);
  } catch (error) {
    console.error('❌ Error fetching books by genre:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const searchAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = { getBooks, storeBooks,specificBook,getBookByGenre,addReview,addToReadList,deleteFromReadList,getAllReadList,checkList,reviewDelete,fetchBooksByReview,fetchByGenre,searchAllBooks };
