import { useState } from 'react'
import './App.css'
import OrganizationSchema from './components/schemas/OrganizationSchema'
import ArticleSchema from './components/schemas/ArticleSchema'
import ProductSchema from './components/schemas/ProductSchema'
import LocalBusinessSchema from './components/schemas/LocalBusinessSchema'
import EventSchema from './components/schemas/EventSchema'
import FAQPageSchema from './components/schemas/FAQPageSchema'
import QAPageSchema from './components/schemas/QAPageSchema'
import RecipeSchema from './components/schemas/RecipeSchema'
import CourseSchema from './components/schemas/CourseSchema'
import JobPostingSchema from './components/schemas/JobPostingSchema'
import BreadcrumbSchema from './components/schemas/BreadcrumbSchema'
import VideoSchema from './components/schemas/VideoSchema'
import PodcastSchema from './components/schemas/PodcastSchema'
import BookSchema from './components/schemas/BookSchema'
import JSONLDViewer from './components/JSONLDViewer'
import SEOChecker from './components/SEOChecker'

function App() {
  const [appMode, setAppMode] = useState('schema') // 'schema' or 'seo'
  const [activeTab, setActiveTab] = useState('article')
  const [activeCategory, setActiveCategory] = useState('content')
  const [schemaData, setSchemaData] = useState({})
  const [copiedText, setCopiedText] = useState(false)

  const schemaCategories = {
    content: {
      name: '📄 Content',
      schemas: {
        article: { name: 'Article', component: ArticleSchema },
        blogPosting: { name: 'Blog Posting', component: ArticleSchema },
        newsArticle: { name: 'News Article', component: ArticleSchema },
        techArticle: { name: 'Tech Article', component: ArticleSchema },
        scholarlyArticle: { name: 'Scholarly Article', component: ArticleSchema },
        report: { name: 'Report', component: ArticleSchema }
      }
    },
    ecommerce: {
      name: '🛍️ E-commerce',
      schemas: {
        product: { name: 'Product', component: ProductSchema },
        offer: { name: 'Offer', component: ProductSchema },
        aggregateOffer: { name: 'Aggregate Offer', component: ProductSchema }
      }
    },
    business: {
      name: '🏢 Business',
      schemas: {
        localBusiness: { name: 'Local Business', component: LocalBusinessSchema },
        organization: { name: 'Organization', component: OrganizationSchema },
        corporation: { name: 'Corporation', component: OrganizationSchema },
        educationalOrganization: { name: 'Educational Organization', component: OrganizationSchema },
        governmentOrganization: { name: 'Government Organization', component: OrganizationSchema },
        ngo: { name: 'NGO', component: OrganizationSchema }
      }
    },
    food: {
      name: '🍴 Food',
      schemas: {
        recipe: { name: 'Recipe', component: RecipeSchema },
        restaurant: { name: 'Restaurant', component: LocalBusinessSchema },
        foodEstablishment: { name: 'Food Establishment', component: LocalBusinessSchema }
      }
    },
    events: {
      name: '📅 Events',
      schemas: {
        event: { name: 'Event', component: EventSchema },
        businessEvent: { name: 'Business Event', component: EventSchema },
        educationEvent: { name: 'Education Event', component: EventSchema },
        socialEvent: { name: 'Social Event', component: EventSchema }
      }
    },
    education: {
      name: '🎓 Education',
      schemas: {
        course: { name: 'Course', component: CourseSchema },
        learningResource: { name: 'Learning Resource', component: CourseSchema }
      }
    },
    qa: {
      name: '❓ Q&A',
      schemas: {
        faqPage: { name: 'FAQ Page', component: FAQPageSchema },
        qaPage: { name: 'Q&A Page', component: QAPageSchema }
      }
    },
    media: {
      name: '📺 Media',
      schemas: {
        video: { name: 'Video', component: VideoSchema },
        podcast: { name: 'Podcast', component: PodcastSchema }
      }
    },
    employment: {
      name: '💼 Employment',
      schemas: {
        jobPosting: { name: 'Job Posting', component: JobPostingSchema }
      }
    },
    navigation: {
      name: '🧭 Navigation',
      schemas: {
        breadcrumb: { name: 'Breadcrumb List', component: BreadcrumbSchema }
      }
    },
    books: {
      name: '📚 Books',
      schemas: {
        book: { name: 'Book', component: BookSchema }
      }
    }
  }

  const CurrentComponent = schemaCategories[activeCategory]?.schemas[activeTab]?.component

  const handleCopyJSON = () => {
    const json = JSON.stringify(schemaData, null, 2)
    navigator.clipboard.writeText(json)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  const renderCategoryTabs = () => {
    return (
      <div className="category-tabs">
        {Object.entries(schemaCategories).map(([key, category]) => (
          <button
            key={key}
            className={`category-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(key)
              setActiveTab(Object.keys(category.schemas)[0])
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    )
  }

  const renderSchemaTabs = () => {
    const schemas = schemaCategories[activeCategory]?.schemas
    if (!schemas) return null

    return (
      <div className="schema-tabs">
        {Object.entries(schemas).map(([key, schema]) => (
          <button
            key={key}
            className={`schema-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
            title={schema.name}
          >
            <span className="name">{schema.name}</span>
          </button>
        ))}
      </div>
    )
  }

  const currentSchemaName = schemaCategories[activeCategory]?.schemas[activeTab]?.name || 'Schema'

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🔍 SEO Tools</h1>
          <p>Professional SEO tools for schema markup and website analysis</p>
        </div>
        <div className="mode-switcher">
          <button
            className={`mode-btn ${appMode === 'schema' ? 'active' : ''}`}
            onClick={() => setAppMode('schema')}
          >
            📄 Schema Generator
          </button>
          <button
            className={`mode-btn ${appMode === 'seo' ? 'active' : ''}`}
            onClick={() => setAppMode('seo')}
          >
            🔎 SEO Checker
          </button>
        </div>
      </header>

      {appMode === 'schema' ? (
        <>
          {renderCategoryTabs()}
          {renderSchemaTabs()}

          <main className="main-container">
            <div className="schema-editor">
              <div className="editor-header">
                <h2>{currentSchemaName} Schema</h2>
              </div>

              {CurrentComponent && <CurrentComponent onDataChange={setSchemaData} schemaType={activeTab} />}
            </div>

            <div className="schema-output">
              <JSONLDViewer
                data={schemaData}
                onCopy={handleCopyJSON}
                copied={copiedText}
              />
            </div>
          </main>
        </>
      ) : (
        <SEOChecker />
      )}
    </div>
  )
}

export default App
