import { useState, useEffect, useMemo } from 'react'
import '../SchemaForm.css'
import DateTimePicker from '../DateTimePicker'

function ArticleSchema({ onDataChange, schemaType }) {
  const typeMapping = useMemo(() => ({
    article: 'Article',
    blogPosting: 'BlogPosting',
    newsArticle: 'NewsArticle',
    techArticle: 'TechArticle',
    scholarlyArticle: 'ScholarlyArticle',
    report: 'Report'
  }), [])

  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': typeMapping[schemaType] || 'Article',
    headline: '',
    description: '',
    image: [],
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: ''
    },
    publisher: {
      '@type': 'Organization',
      name: '',
      logo: {
        '@type': 'ImageObject',
        url: ''
      }
    },
    articleBody: ''
  })

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      '@type': typeMapping[schemaType] || 'Article'
    }))
  }, [schemaType, typeMapping])

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

  const addImage = () => {
    setFormData({
      ...formData,
      image: [...formData.image, { '@type': 'ImageObject', url: '', width: '', height: '' }]
    })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      image: formData.image.filter((_, i) => i !== index)
    })
  }

  const updateImage = (index, field, value) => {
    const newImages = [...formData.image]
    newImages[index][field] = value
    setFormData({
      ...formData,
      image: newImages
    })
  }

  return (
    <form className="schema-form">
      <div className="form-field-group">
        <label className="field-label">Article Headline *</label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="Article headline"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Images (Multiple)</div>
      {formData.image.map((img, index) => (
        <div key={index} className="nested-section">
          <div className="section-actions">
            <span className="section-label">Image {index + 1}</span>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="btn btn-delete-small"
            >
              ✕
            </button>
          </div>

          <div className="form-field-group">
            <label className="field-label">Image URL</label>
            <input
              type="url"
              value={img.url}
              onChange={(e) => updateImage(index, 'url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <label className="field-label">Width (px)</label>
              <input
                type="number"
                value={img.width}
                onChange={(e) => updateImage(index, 'width', e.target.value)}
                placeholder="800"
                className="form-input"
              />
            </div>
            <div className="form-field-group">
              <label className="field-label">Height (px)</label>
              <input
                type="number"
                value={img.height}
                onChange={(e) => updateImage(index, 'height', e.target.value)}
                placeholder="600"
                className="form-input"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addImage}
        className="btn btn-secondary"
      >
        + Add Image
      </button>

      <div className="form-section-header">Publication Dates</div>

      <DateTimePicker
        label="Published Date"
        value={formData.datePublished}
        onChange={(date) => handleChange('datePublished', date)}
        required={true}
        hint="Includes timezone and seconds"
      />

      <DateTimePicker
        label="Modified Date"
        value={formData.dateModified}
        onChange={(date) => handleChange('dateModified', date)}
        hint="Last update date"
      />

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

      <div className="form-field-group">
        <label className="field-label">Publisher Logo URL</label>
        <input
          type="url"
          value={formData.publisher.logo.url}
          onChange={(e) => handleChange('publisher.logo.url', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Article Content</div>

      <div className="form-field-group">
        <label className="field-label">Article Body</label>
        <textarea
          value={formData.articleBody}
          onChange={(e) => handleChange('articleBody', e.target.value)}
          placeholder="Full article content..."
          className="form-input"
          rows="6"
        />
      </div>
    </form>
  )
}

export default ArticleSchema
