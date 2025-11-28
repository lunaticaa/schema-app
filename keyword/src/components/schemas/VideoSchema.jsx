import { useState, useEffect } from 'react'
import '../SchemaForm.css'
import DateTimePicker from '../DateTimePicker'

function VideoSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: '',
    description: '',
    thumbnailUrl: '',
    uploadDate: new Date().toISOString(),
    duration: 'PT5M',
    contentUrl: '',
    embedUrl: '',
    interactionCount: '0',
    author: {
      '@type': 'Person',
      name: ''
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
        <label className="field-label">Video Title *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Video title"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Video description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
          placeholder="https://example.com/thumbnail.jpg"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Content URL</label>
        <input
          type="url"
          value={formData.contentUrl}
          onChange={(e) => handleChange('contentUrl', e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Embed URL</label>
        <input
          type="url"
          value={formData.embedUrl}
          onChange={(e) => handleChange('embedUrl', e.target.value)}
          placeholder="https://youtube.com/embed/xxx"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Video Details</div>

      <div className="form-row">
        <DateTimePicker
          label="Upload Date"
          value={formData.uploadDate}
          onChange={(date) => handleChange('uploadDate', date)}
          hint="When the video was published"
        />
        <div className="form-field-group">
          <label className="field-label">Duration (ISO 8601)</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="PT5M"
            className="form-input"
          />
          <small className="field-hint">PT5M = 5 minutes</small>
        </div>
      </div>

      <div className="form-field-group">
        <label className="field-label">Interaction Count</label>
        <input
          type="number"
          value={formData.interactionCount}
          onChange={(e) => handleChange('interactionCount', e.target.value)}
          placeholder="0"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Author</div>

      <div className="form-field-group">
        <label className="field-label">Author Name</label>
        <input
          type="text"
          value={formData.author.name}
          onChange={(e) => handleChange('author.name', e.target.value)}
          placeholder="Author name"
          className="form-input"
        />
      </div>
    </form>
  )
}

export default VideoSchema
