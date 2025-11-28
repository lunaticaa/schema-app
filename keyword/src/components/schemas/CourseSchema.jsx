import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function CourseSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: '',
    description: '',
    url: '',
    image: '',
    provider: {
      '@type': 'Organization',
      name: ''
    },
    instructor: {
      '@type': 'Person',
      name: ''
    },
    duration: 'P4W',
    learningResourceType: 'Course'
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
        <label className="field-label">Course Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Course name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Course description..."
          className="form-input"
          rows="4"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Course URL</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com/course"
          className="form-input"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Course Image</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/course-image.jpg"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Provider</div>

      <div className="form-field-group">
        <label className="field-label">Provider Name</label>
        <input
          type="text"
          value={formData.provider.name}
          onChange={(e) => handleChange('provider.name', e.target.value)}
          placeholder="Organization name"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Instructor</div>

      <div className="form-field-group">
        <label className="field-label">Instructor Name</label>
        <input
          type="text"
          value={formData.instructor.name}
          onChange={(e) => handleChange('instructor.name', e.target.value)}
          placeholder="Instructor name"
          className="form-input"
        />
      </div>

      <div className="form-section-header">Course Details</div>

      <div className="form-field-group">
        <label className="field-label">Duration (ISO 8601)</label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          placeholder="P4W (4 weeks)"
          className="form-input"
        />
        <small className="field-hint">ISO 8601 format (P4W = 4 weeks, P2D = 2 days)</small>
      </div>

      <div className="form-field-group">
        <label className="field-label">Learning Resource Type</label>
        <select
          value={formData.learningResourceType}
          onChange={(e) => handleChange('learningResourceType', e.target.value)}
          className="form-input"
        >
          <option value="Course">Course</option>
          <option value="Textbook">Textbook</option>
          <option value="Video">Video</option>
          <option value="Article">Article</option>
        </select>
      </div>
    </form>
  )
}

export default CourseSchema
