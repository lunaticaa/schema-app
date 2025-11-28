import { useState, useEffect } from 'react'
import '../SchemaForm.css'
import DateTimePicker from '../DateTimePicker'

function BookSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: '',
    author: {
      '@type': 'Person',
      name: ''
    },
    publisher: {
      '@type': 'Organization',
      name: ''
    },
    datePublished: '',
    description: '',
    image: '',
    isbn: '',
    numberOfPages: '',
    bookEdition: ''
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const handleChange = (path, value) => {
    const keys = path.split('.')
    const newData = JSON.parse(JSON.stringify(formData))
    let current = newData
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setFormData(newData)
  }

  return (
    <form className="schema-form">
      <div className="form-field-group">
        <label className="field-label">Book Title *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Book title"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Book description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Book Cover Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/book-cover.jpg"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Author Information</div>

      <div className="form-field-group">
        <label className="field-label">Author Name *</label>
        <input
          type="text"
          value={formData.author.name}
          onChange={(e) => handleChange('author.name', e.target.value)}
          placeholder="Author name"
          className="form-input"
          required
        />
      </div>

      <div className="form-section-header">Publisher Information</div>

      <div className="form-field-group">
        <label className="field-label">Publisher Name</label>
        <input
          type="text"
          value={formData.publisher.name}
          onChange={(e) => handleChange('publisher.name', e.target.value)}
          placeholder="Publisher name"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Book Details</div>

      <DateTimePicker
        label="Publication Date"
        value={formData.datePublished}
        onChange={(date) => handleChange('datePublished', date)}
        hint="Book publication date and time"
      />

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">ISBN</label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => handleChange('isbn', e.target.value)}
            placeholder="978-0-1234567-8-9"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Number of Pages</label>
          <input
            type="number"
            value={formData.numberOfPages}
            onChange={(e) => handleChange('numberOfPages', e.target.value)}
            placeholder="300"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field-group">
        <label className="field-label">Book Edition</label>
        <input
          type="text"
          value={formData.bookEdition}
          onChange={(e) => handleChange('bookEdition', e.target.value)}
          placeholder="First Edition"
          className="form-input"
        />
      </div>
    </form>
  )
}

export default BookSchema
