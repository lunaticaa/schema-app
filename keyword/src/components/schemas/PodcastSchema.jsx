import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function PodcastSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: '',
    description: '',
    image: '',
    author: {
      '@type': 'Person',
      name: ''
    },
    url: '',
    numberOfEpisodes: ''
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
        <label className="field-label">Podcast Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Podcast name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Podcast description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Podcast Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/podcast-image.jpg"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Podcast URL</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com/podcast"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Author</div>

      <div className="form-field-group">
        <label className="field-label">Host/Author Name</label>
        <input
          type="text"
          value={formData.author.name}
          onChange={(e) => handleChange('author.name', e.target.value)}
          placeholder="Host name"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Episode Information</div>

      <div className="form-field-group">
        <label className="field-label">Number of Episodes</label>
        <input
          type="number"
          value={formData.numberOfEpisodes}
          onChange={(e) => handleChange('numberOfEpisodes', e.target.value)}
          placeholder="25"
          className="form-input"
        />
      </div>
    </form>
  )
}

export default PodcastSchema
