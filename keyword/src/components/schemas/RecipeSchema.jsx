import { useState, useEffect } from 'react'
import '../SchemaForm.css'

function RecipeSchema({ onDataChange }) {
  const [formData, setFormData] = useState({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: '',
    description: '',
    image: '',
    author: {
      '@type': 'Person',
      name: ''
    },
    prepTime: 'PT15M',
    cookTime: 'PT30M',
    totalTime: 'PT45M',
    recipeYield: '4 servings',
    recipeCategory: 'Dessert',
    recipeCuisine: 'Italian',
    recipeIngredient: [],
    recipeInstructions: [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '',
      ratingCount: ''
    }
  })

  useEffect(() => {
    onDataChange(formData)
  }, [formData, onDataChange])

  const addIngredient = () => {
    setFormData({
      ...formData,
      recipeIngredient: [...formData.recipeIngredient, '']
    })
  }

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      recipeIngredient: formData.recipeIngredient.filter((_, i) => i !== index)
    })
  }

  const updateIngredient = (index, value) => {
    const newIngredients = [...formData.recipeIngredient]
    newIngredients[index] = value
    setFormData({
      ...formData,
      recipeIngredient: newIngredients
    })
  }

  const addInstruction = () => {
    setFormData({
      ...formData,
      recipeInstructions: [...formData.recipeInstructions, { '@type': 'HowToStep', text: '' }]
    })
  }

  const removeInstruction = (index) => {
    setFormData({
      ...formData,
      recipeInstructions: formData.recipeInstructions.filter((_, i) => i !== index)
    })
  }

  const updateInstruction = (index, value) => {
    const newInstructions = [...formData.recipeInstructions]
    newInstructions[index].text = value
    setFormData({
      ...formData,
      recipeInstructions: newInstructions
    })
  }

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
        <label className="field-label">Recipe Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Recipe name"
          className="form-input"
          required
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Recipe description..."
          className="form-input"
          rows="3"
        />
      </div>

      <div className="form-field-group">
        <label className="field-label">Recipe Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/recipe.jpg"
          className="form-input"
        />
      </div>

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

      <div className="form-section-header">Timing & Servings</div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Prep Time (ISO 8601)</label>
          <input
            type="text"
            value={formData.prepTime}
            onChange={(e) => handleChange('prepTime', e.target.value)}
            placeholder="PT15M"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Cook Time (ISO 8601)</label>
          <input
            type="text"
            value={formData.cookTime}
            onChange={(e) => handleChange('cookTime', e.target.value)}
            placeholder="PT30M"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Total Time (ISO 8601)</label>
          <input
            type="text"
            value={formData.totalTime}
            onChange={(e) => handleChange('totalTime', e.target.value)}
            placeholder="PT45M"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Yield</label>
          <input
            type="text"
            value={formData.recipeYield}
            onChange={(e) => handleChange('recipeYield', e.target.value)}
            placeholder="4 servings"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field-group">
          <label className="field-label">Category</label>
          <input
            type="text"
            value={formData.recipeCategory}
            onChange={(e) => handleChange('recipeCategory', e.target.value)}
            placeholder="Dessert"
            className="form-input"
          />
        </div>
        <div className="form-field-group">
          <label className="field-label">Cuisine</label>
          <input
            type="text"
            value={formData.recipeCuisine}
            onChange={(e) => handleChange('recipeCuisine', e.target.value)}
            placeholder="Italian"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section-header">Ingredients</div>

      {formData.recipeIngredient.map((ingredient, index) => (
        <div key={index} className="nested-section">
          <div className="section-actions">
            <span className="section-label">Ingredient {index + 1}</span>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="btn btn-delete-small"
            >
              ✕
            </button>
          </div>
          <div className="form-field-group">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              placeholder="2 cups flour"
              className="form-input"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="btn btn-secondary"
      >
        + Add Ingredient
      </button>

      <div className="form-section-header">Instructions</div>

      {formData.recipeInstructions.map((instruction, index) => (
        <div key={index} className="nested-section">
          <div className="section-actions">
            <span className="section-label">Step {index + 1}</span>
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="btn btn-delete-small"
            >
              ✕
            </button>
          </div>
          <div className="form-field-group">
            <textarea
              value={instruction.text}
              onChange={(e) => updateInstruction(index, e.target.value)}
              placeholder="Instruction details..."
              className="form-input"
              rows="2"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addInstruction}
        className="btn btn-secondary"
      >
        + Add Instruction
      </button>

      <div className="form-section-header">Rating</div>

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
          <label className="field-label">Rating Count</label>
          <input
            type="number"
            value={formData.aggregateRating.ratingCount}
            onChange={(e) => handleChange('aggregateRating.ratingCount', e.target.value)}
            placeholder="100"
            className="form-input"
          />
        </div>
      </div>
    </form>
  )
}

export default RecipeSchema
