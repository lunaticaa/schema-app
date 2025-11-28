import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function ProductSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '',
    description: '',
    image: '',
    brand: {
      '@type': 'Brand',
      name: ''
    },
    offers: {
      '@type': 'Offer',
      url: '',
      priceCurrency: 'USD',
      price: '',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '',
      reviewCount: ''
    }
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
        <label className="field-label">Product Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Product name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Product description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Product Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/product.jpg"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Brand Name</label>
        <input
          type="text"
          value={formData.brand.name}
          onChange={(e) => handleChange('brand.name', e.target.value)}
          placeholder="Brand name"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Pricing Information</div>

      <div className="form-field-group">
        <label className="field-label">Price *</label>
        <input
          type="number"
          step="0.01"
          value={formData.offers.price}
          onChange={(e) => handleChange('offers.price', e.target.value)}
          placeholder="99.99"
          className="form-input"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Currency</label>
          <input
            type="text"
            value={formData.offers.priceCurrency}
            onChange={(e) => handleChange('offers.priceCurrency', e.target.value)}
            placeholder="USD"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Product URL</label>
          <input
            type="url"
            value={formData.offers.url}
            onChange={(e) => handleChange('offers.url', e.target.value)}
            placeholder="https://example.com/product"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-field-group">
        <label className="field-label">Availability</label>
        <select
          value={formData.offers.availability}
          onChange={(e) => handleChange('offers.availability', e.target.value)}
          className="form-input"
        >
          <option value="https://schema.org/InStock">In Stock</option>
          <option value="https://schema.org/OutOfStock">Out of Stock</option>
          <option value="https://schema.org/PreOrder">Pre-order</option>
          <option value="https://schema.org/BackOrder">Back order</option>
        </select>
      </div>

      <div className="form-section-header">Rating Information</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Rating (0-5)</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.aggregateRating.ratingValue}
            onChange={(e) => handleChange('aggregateRating.ratingValue', e.target.value)}
            placeholder="4.5"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Review Count</label>
          <input
            type="number"
            value={formData.aggregateRating.reviewCount}
            onChange={(e) => handleChange('aggregateRating.reviewCount', e.target.value)}
            placeholder="100"
            className="form-input"
          />
        </div>
      </div>
    </form>
  )
}

export default ProductSchema
