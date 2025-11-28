import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function LocalBusinessSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: '',
    image: '',
    description: '',
    url: '',
    telephone: '',
    email: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: ''
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '',
      longitude: ''
    },
    priceRange: '$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Monday',
        opens: '09:00',
        closes: '17:00'
      }
    ]
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
        <label className="field-label">Business Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Business name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Business Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Business description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Website URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Price Range</label>
          <select
            value={formData.priceRange}
            onChange={(e) => handleChange('priceRange', e.target.value)}
            className="form-input"
          >
            <option value="$">$ (Budget)</option>
            <option value="$$">$$ (Moderate)</option>
            <option value="$$$">$$$ (Expensive)</option>
            <option value="$$$$">$$$$ (Very Expensive)</option>
          </select>
        </div>
      </div>

      <div className="form-section-header">Contact Information</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Phone</label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleChange('telephone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@example.com"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Address</div>

      <div className="form-field-group">
        <label className="field-label">Street Address</label>
        <input
          type="text"
          value={formData.address.streetAddress}
          onChange={(e) => handleChange('address.streetAddress', e.target.value)}
          placeholder="123 Main St"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">City</label>
          <input
            type="text"
            value={formData.address.addressLocality}
            onChange={(e) => handleChange('address.addressLocality', e.target.value)}
            placeholder="New York"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">State</label>
          <input
            type="text"
            value={formData.address.addressRegion}
            onChange={(e) => handleChange('address.addressRegion', e.target.value)}
            placeholder="NY"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Postal Code</label>
          <input
            type="text"
            value={formData.address.postalCode}
            onChange={(e) => handleChange('address.postalCode', e.target.value)}
            placeholder="10001"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Country</label>
          <input
            type="text"
            value={formData.address.addressCountry}
            onChange={(e) => handleChange('address.addressCountry', e.target.value)}
            placeholder="US"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Coordinates</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={formData.geo.latitude}
            onChange={(e) => handleChange('geo.latitude', e.target.value)}
            placeholder="40.7128"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={formData.geo.longitude}
            onChange={(e) => handleChange('geo.longitude', e.target.value)}
            placeholder="-74.0060"
            className="form-input"
          />
        </div>
      </div>
    </form>
  )
}

export default LocalBusinessSchema
