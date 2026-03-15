

router.get('/all',getBooks);
router.get('/specificbook/:bid',specificBook);
router.get('/genre/:genre',getBookByGenre);
router.post('/review/:bid',protect,addReview);
router.post('/readlist/:bid',protect,addToReadList);
router.get('/readlist',protect,getAllReadList);
router.delete('/readlist/:bid',protect,deleteFromReadList);
router.get('/checklist/:bid',protect,checkList);
router.get('/reviews',protect,fetchBooksByReview);
router.delete('/review/:bid/:rid',protect,reviewDelete);
router.get('/genre/:genre',fetchByGenre);
router.get('/search',searchAllBooks);


router.post('/askquestion',protect,askQuestion);
router.get('/checkhistory',protect,historyFetch);



router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/updatepassword',protect,updatePassword);