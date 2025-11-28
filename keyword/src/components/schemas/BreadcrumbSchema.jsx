import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function BreadcrumbSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: []
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const addBreadcrumb = () => {
    setFormData({
      ...formData,
      itemListElement: [...formData.itemListElement, {
        '@type': 'ListItem',
        position: formData.itemListElement.length + 1,
        name: '',
        item: ''
      }]
    })
  }

  const removeBreadcrumb = (index) => {
    setFormData({
      ...formData,
      itemListElement: formData.itemListElement.filter((_, i) => i !== index)
    })
  }

  const updateBreadcrumb = (index, field, value) => {
    const newItems = [...formData.itemListElement]
    newItems[index][field] = value
    setFormData({
      ...formData,
      itemListElement: newItems
    })
  }

  return (
    <form className="schema-form">
      <div className="form-section-header">Breadcrumb Items</div>

      {formData.itemListElement.map((item, index) => (
        <div key={index} className="nested-section">
          <div className="section-actions">
            <span className="section-label">Breadcrumb {index + 1}</span>
            <button
              type="button"
              onClick={() => removeBreadcrumb(index)}
              className="btn btn-delete-small"
            >
              ✕
            </button>
          </div>

          <div className="form-field-group">
            <label className="field-label">Breadcrumb Name *</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateBreadcrumb(index, 'name', e.target.value)}
              placeholder="e.g., Home"
              className="form-input"
              required
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">URL *</label>
            <input
              type="url"
              value={item.item}
              onChange={(e) => updateBreadcrumb(index, 'item', e.target.value)}
              placeholder="https://example.com/page"
              className="form-input"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addBreadcrumb}
        className="btn btn-secondary"
      >
        + Add Breadcrumb
      </button>
    </form>
  )
}

export default BreadcrumbSchema
