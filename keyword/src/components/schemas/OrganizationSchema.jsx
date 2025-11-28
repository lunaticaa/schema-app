import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function OrganizationSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '',
    url: '',
    logo: '',
    description: '',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'Customer Service'
    },
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: ''
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

  const addSocialProfile = () => {
    setFormData({
      ...formData,
      sameAs: [...formData.sameAs, '']
    })
  }

  const removeSocialProfile = (index) => {
    setFormData({
      ...formData,
      sameAs: formData.sameAs.filter((_, i) => i !== index)
    })
  }

  const updateSocialProfile = (index, value) => {
    const newSameAs = [...formData.sameAs]
    newSameAs[index] = value
    setFormData({
      ...formData,
      sameAs: newSameAs
    })
  }

  return (
    <form className="schema-form">
      <div className="form-field-group">
        <label className="field-label">Organization Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Company name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Website URL *</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Logo URL</label>
        <input
          type="url"
          value={formData.logo}
          onChange={(e) => handleChange('logo', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Company description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-section-header">Contact Information</div>

      <div className="form-field-group">
        <label className="field-label">Phone</label>
        <input
          type="tel"
          value={formData.contactPoint.telephone}
          onChange={(e) => handleChange('contactPoint.telephone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="form-input"
        />
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
          <label className="field-label">State/Province</label>
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

      <div className="form-section-header">Social Media Profiles</div>

      {formData.sameAs.map((url, index) => (
        <div key={index} className="form-field-group social-profile">
          <input
            type="url"
            value={url}
            onChange={(e) => updateSocialProfile(index, e.target.value)}
            placeholder="https://social.com/profile"
            className="form-input"
          />
          <button
            type="button"
            onClick={() => removeSocialProfile(index)}
            className="btn btn-delete"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSocialProfile}
        className="btn btn-secondary"
      >
        + Add Social Profile
      </button>
    </form>
  )
}

export default OrganizationSchema
