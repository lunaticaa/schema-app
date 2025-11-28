import { useState } from 'react'
import './SchemaBuilder.css'

function SchemaBuilder({ schema, onSchemaChange }) {
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('text')
  const [fieldRequired, setFieldRequired] = useState(false)
  const [schemaTitle, setSchemaTitle] = useState(schema.title)

  const addField = () => {
    if (!fieldName.trim()) {
      alert('Please enter a field name')
      return
    }

    const newField = {
      id: Date.now(),
      name: fieldName,
      type: fieldType,
      required: fieldRequired,
      label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }

    onSchemaChange({
      ...schema,
      title: schemaTitle,
      fields: [...schema.fields, newField]
    })

    setFieldName('')
    setFieldType('text')
    setFieldRequired(false)
  }

  const removeField = (id) => {
    onSchemaChange({
      ...schema,
      fields: schema.fields.filter(f => f.id !== id)
    })
  }

  const updateSchemaTitle = (newTitle) => {
    setSchemaTitle(newTitle)
    onSchemaChange({
      ...schema,
      title: newTitle
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addField()
    }
  }

  return (
    <div className="schema-builder">
      <div className="builder-section">
        <h2>Schema Details</h2>
        <div className="form-group">
          <label htmlFor="schema-title">Schema Title</label>
          <input
            id="schema-title"
            type="text"
            value={schemaTitle}
            onChange={(e) => updateSchemaTitle(e.target.value)}
            placeholder="Enter schema title"
            className="input-field"
          />
        </div>
      </div>

      <div className="builder-section">
        <h2>Add New Field</h2>
        <div className="form-group">
          <label htmlFor="field-name">Field Name</label>
          <input
            id="field-name"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., firstName, email"
            className="input-field"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="field-type">Field Type</label>
            <select
              id="field-type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="select-field"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="checkbox">Checkbox</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="field-required">
              <input
                id="field-required"
                type="checkbox"
                checked={fieldRequired}
                onChange={(e) => setFieldRequired(e.target.checked)}
              />
              Required
            </label>
          </div>
        </div>

        <button onClick={addField} className="btn btn-primary">
          Add Field
        </button>
      </div>

      <div className="builder-section">
        <h2>Fields ({schema.fields.length})</h2>
        {schema.fields.length === 0 ? (
          <p className="empty-message">No fields added yet. Add your first field above!</p>
        ) : (
          <div className="fields-list">
            {schema.fields.map((field) => (
              <div key={field.id} className="field-item">
                <div className="field-info">
                  <strong className="field-label">{field.label}</strong>
                  <span className="field-type">{field.type}</span>
                  {field.required && <span className="field-required">Required</span>}
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="btn btn-delete"
                  title="Delete field"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="builder-section">
        <h2>Schema JSON</h2>
        <pre className="json-output">{JSON.stringify(schema, null, 2)}</pre>
      </div>
    </div>
  )
}

export default SchemaBuilder
