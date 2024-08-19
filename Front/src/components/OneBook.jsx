import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../assets/css/bookbtn.css'

const OneBook = () => {
  const openPdf = () => {
    if (book.pdfUrl) {
      window.open(book.pdfUrl, '_blank');
    } else {
      alert('PDF not available for this book.');
    }
    handleCloseModal();
  };
  
  const { category, bookId } = useParams();
  const [isImageLarge, setIsImageLarge] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const addToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav._id === book._id)) {
      favorites.push(book);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Book added to favorites!');
    } else {
      alert('This book is already in your favorites!');
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${category}/${bookId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Could not fetch book:", error);
        setError('Failed to load book. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [category, bookId]);

  const handleImageClick = () => {
    setIsImageLarge(!isImageLarge);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <Card>
            <div onClick={handleImageClick} style={{ cursor: 'pointer', overflow: 'hidden' }}>
              <Card.Img
                variant="top"
                src={book.cover}
                alt={book.title}
                style={{
                  height: '500px',
                  objectFit: 'contain',
                  width: '100%'
                }}
              />
            </div>
          </Card>
          <Button className="my-3 read-book-btn" style={{ width: '100%' }} onClick={handleShowModal}>Read This Book</Button>
          <Button className="my-1 add-to-favorites-btn" style={{ width: '100%' }} onClick={addToFavorites}>Add To Favorite</Button>
        </Col>
        <Col md={8}>
          <h1 className="mb-3" style={{ fontWeight: 'bold' }}>{book.title}</h1>
          <h4 className="mb-3">{book.author}</h4>
          <p className="mb-3"><strong>Description:</strong></p>
          <p className="mb-4">{book.description}</p>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Open The Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>Click Yes To View "{book.title}" Content</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={openPdf}>
            YES
          </Button>
        </Modal.Footer>
      </Modal>

      {isImageLarge && (
        <div
          onClick={handleImageClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          <img
            src={book.cover}
            alt={book.title}
            style={{
              maxHeight: '80%',
              maxWidth: '80%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default OneBook;
