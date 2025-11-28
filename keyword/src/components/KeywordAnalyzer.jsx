import { useState } from 'react'
import './KeywordAnalyzer.css'

function KeywordAnalyzer() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Persian character detection and normalization
  const isPersianKeyword = (text) => {
    const persianRegex = /[\u0600-\u06FF]/g
    return (text.match(persianRegex) || []).length > 0
  }

  const normalizePersian = (text) => {
    // Normalize Persian/Arabic characters
    let normalized = text
    const normalizations = {
      'ی': 'ی', // Normalize Farsi Yeh
      'ك': 'ک', // Normalize Arabic Kaf to Farsi Kaf
      'ة': 'ه', // Normalize Teh Marbuta
    }
    Object.entries(normalizations).forEach(([from, to]) => {
      normalized = normalized.replace(new RegExp(from, 'g'), to)
    })
    return normalized.trim()
  }

  // Iranian seasonal trends
  const getSeasonalMultiplier = (keyword) => {
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    // Nowruz season (Feb 20 - Mar 21)
    if ((month === 1 && day >= 20) || (month === 2)) {
      if (keyword.includes('نوروز') || keyword.includes('سال') || keyword.includes('هدیه')) {
        return 2.5
      }
    }

    // Summer season (Jun - Aug)
    if (month >= 5 && month <= 7) {
      if (keyword.includes('تابستان') || keyword.includes('گردشگری') || keyword.includes('سفر')) {
        return 1.8
      }
    }

    // Back to school (Aug - Sep)
    if (month === 7 || month === 8) {
      if (keyword.includes('مدرسه') || keyword.includes('تحصیل') || keyword.includes('دانشگاه')) {
        return 1.7
      }
    }

    // End of year/New Year (Dec - Jan)
    if (month === 11 || month === 0) {
      if (keyword.includes('سال') || keyword.includes('جشن') || keyword.includes('تخفیف')) {
        return 1.6
      }
    }

    return 1.0
  }

  // Analyze real user demand and intent
  const analyzeUserDemand = (keyword) => {
    let demandScore = 50

    // High demand patterns
    const highDemandPatterns = {
      commercial: ['خرید', 'قیمت', 'فروش', 'سفارش', 'فروشنده', 'فروشگاه', 'کیف', 'پول', 'پرداخت', 'کارت'],
      informational: ['آموزش', 'نحوه', 'چیست', 'توضیح', 'تعریف', 'راهنما', 'آشنایی', 'معنی'],
      transactional: ['دانلود', 'ثبت نام', 'ورود', 'رزرو', 'حجز', 'اپلیکیشن', 'پلگین'],
      navigational: ['رسمی', 'سایت', 'اپ', 'شماره', 'تماس', 'آدرس'],
    }

    const commercialCount = highDemandPatterns.commercial.filter(p => keyword.includes(p)).length
    const infoCount = highDemandPatterns.informational.filter(p => keyword.includes(p)).length
    const transCount = highDemandPatterns.transactional.filter(p => keyword.includes(p)).length
    const navCount = highDemandPatterns.navigational.filter(p => keyword.includes(p)).length

    if (commercialCount > 0) demandScore += commercialCount * 15
    if (infoCount > 0) demandScore += infoCount * 12
    if (transCount > 0) demandScore += transCount * 14
    if (navCount > 0) demandScore += navCount * 8

    return Math.min(100, demandScore)
  }

  // Estimate search volume using advanced factors
  const estimateSearchVolumeWithTrends = (text) => {
    let volume = 40 // Base volume

    // 1. REAL USER DEMAND
    const demandScore = analyzeUserDemand(text)
    volume += (demandScore / 100) * 30

    // 2. LENGTH ANALYSIS (shorter = more searches generally)
    const textLength = text.length
    if (textLength === 1) volume += 35
    else if (textLength === 2) volume += 32
    else if (textLength <= 4) volume += 25
    else if (textLength <= 6) volume += 15
    else if (textLength <= 10) volume += 8
    else if (textLength <= 15) volume += 2
    else volume -= 3

    // 3. WORD COUNT & TAIL LENGTH
    const wordCount = text.split(/\s+/).length
    if (wordCount === 1) volume += 20 // Short-tail keywords have higher volume
    else if (wordCount === 2) volume += 10
    else if (wordCount === 3) volume += 2
    else if (wordCount >= 4) volume -= 8 // Long-tail has lower volume

    // 4. SEASONAL TRENDS
    const seasonalMultiplier = getSeasonalMultiplier(text)
    volume *= seasonalMultiplier

    // 5. GEOGRAPHIC LOCATION (Iran-specific)
    const iranCities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'قزوین', 'رشت', 'کیش', 'قشم', 'کرمانشاه', 'اهواز']
    const hasIranLocation = iranCities.some(city => text.includes(city))
    if (hasIranLocation) {
      volume *= 0.8 // Local keywords have lower national volume but higher local intent
    }

    // 6. LANGUAGE & SPELLING VARIATIONS
    const persianChars = (text.match(/[\u0600-\u06FF]/g) || []).length
    const persianRatio = persianChars / text.length
    if (persianRatio > 0.9) volume += 5 // Pure Persian gets boost
    if (persianRatio < 0.3) volume -= 10 // Mixed/English keywords less common in Iran

    // 7. PLURAL & VARIATIONS (estimate based on structure)
    if (text.endsWith('ها')) volume *= 0.95 // Plural forms usually have slightly less volume
    if (text.includes('تر')) volume *= 0.92 // Comparative forms

    // 8. SEARCH INTENT STRENGTH
    const veryHighIntentKeywords = ['خرید', 'قیمت', 'آموزش', 'نحوه', 'بهترین']
    const intentCount = veryHighIntentKeywords.filter(kw => text.includes(kw)).length
    volume += intentCount * 8

    // Normalize to 1-100 range
    return Math.min(100, Math.max(1, volume))
  }

  // Estimate keyword difficulty with comprehensive SERP analysis
  const estimateKeywordDifficulty = (text) => {
    let difficulty = 15 // Base difficulty

    // 1. KEYWORD LENGTH (shorter = more competitors)
    const textLength = text.length
    if (textLength === 1) difficulty += 55 // Single char EXTREMELY competitive
    else if (textLength === 2) difficulty += 50 // Two chars very competitive
    else if (textLength <= 4) difficulty += 40
    else if (textLength <= 6) difficulty += 28
    else if (textLength <= 10) difficulty += 15
    else if (textLength <= 15) difficulty += 8
    else difficulty += 2

    // 2. WORD COUNT (single word more competitive)
    const wordCount = text.split(/\s+/).length
    if (wordCount === 1) difficulty += 30
    else if (wordCount === 2) difficulty += 15
    else if (wordCount === 3) difficulty += 8
    else if (wordCount >= 4) difficulty -= 10

    // 3. COMPETITOR DOMAIN AUTHORITY (estimated by keyword type)
    const premiumBrands = ['سامسونگ', 'اپل', 'ایسوس', 'لنوو', 'ایچ‌پی', 'بانک', 'شرکت', 'دولتی', 'رسمی']
    const brandCount = premiumBrands.filter(brand => text.includes(brand)).length
    if (brandCount > 0) difficulty += brandCount * 18 // Brand keywords have stronger competitors

    // 4. BACKLINK PROFILE STRENGTH (estimated by keyword specificity)
    // Generic keywords attract high-authority sites (news, directories)
    const genericTerms = ['بهترین', 'مشهور', 'معروف', 'پرطرفدار', 'محبوب', 'سفارش']
    const genericCount = genericTerms.filter(term => text.includes(term)).length
    if (genericCount > 0) difficulty += genericCount * 12

    // 5. CONTENT QUALITY REQUIREMENTS (from search intent)
    const requiresDeepContent = ['آموزش', 'راهنما', 'نحوه', 'گام به گام', 'جامع', 'کامل']
    const deepContentCount = requiresDeepContent.filter(term => text.includes(term)).length
    if (deepContentCount > 0) difficulty += deepContentCount * 10

    // 6. SERP FEATURES (news, featured snippets, shopping, etc.)
    const serpFeatureKeywords = ['خبر', 'جدید', 'امروز', 'خرید', 'قیمت', 'تصویر', 'ویدیو']
    const serpCount = serpFeatureKeywords.filter(term => text.includes(term)).length
    if (serpCount > 0) difficulty += serpCount * 8

    // 7. SEARCH INTENT MATCH
    const commercialTerms = ['خرید', 'قیمت', 'فروش', 'سفارش', 'کمترین قیمت', 'بهترین قیمت']
    const commercialCount = commercialTerms.filter(term => text.includes(term)).length
    if (commercialCount > 0) difficulty += commercialCount * 14

    // 8. FRESHNESS REQUIREMENT (news vs evergreen)
    const freshnessRequired = ['خبر', 'جدید', 'امروز', 'دیروز', 'هفته', 'ماه', 'سال']
    if (freshnessRequired.some(term => text.includes(term))) {
      difficulty += 5 // Freshness-focused keywords slightly less competitive (easier to rank with new content)
    }

    // 9. LOCAL RELEVANCE (local keywords easier to rank)
    const iranCities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'رشت', 'قزوین', 'کیش', 'قشم']
    const cityCount = iranCities.filter(city => text.includes(city)).length
    if (cityCount > 0) difficulty -= 15 // Local keywords less competitive nationally

    // 10. USER ENGAGEMENT SIGNALS (estimated by keyword popularity)
    const highEngagementPatterns = ['بهترین', 'مقایسه', 'رتبه بندی', 'نظر', 'کامنت']
    const engagementCount = highEngagementPatterns.filter(pattern => text.includes(pattern)).length
    if (engagementCount > 0) difficulty += engagementCount * 8

    // 11. COMPETITOR OPTIMIZATION LEVEL (estimate by keyword structure)
    // Keywords with numbers/specs show high optimization efforts
    if (text.match(/\d/) || text.match(/[\u0660-\u0669]/)) {
      difficulty += 8 // Competitors likely well-optimized for specific searches
    }

    // 12. CONTENT AGE & FRESHNESS ADVANTAGE
    if (text.includes('جدید') || text.includes('نوتر')) {
      difficulty -= 5 // Advantage for new content
    }

    // Normalize to 5-100 range (never go too low)
    return Math.min(100, Math.max(5, difficulty))
  }

  // Calculate keyword opportunity score
  const calculateOpportunity = (difficulty, volume) => {
    // Opportunity = volume / difficulty (normalized)
    // High volume + Low difficulty = Best opportunity
    if (difficulty === 0) difficulty = 1 // Avoid division by zero
    if (difficulty > 100) difficulty = 100
    
    // Score = (volume / (difficulty + 1)) * 100
    // This gives us 0-100 scale
    return Math.min(100, (volume / (difficulty / 100 + 1)) * 50)
  }

  // Fetch data from free APIs
  const fetchKeywordDataFromAPIs = async (keyword) => {
    let apiData = {
      searchVolume: null,
      difficulty: null,
      cpc: null,
      competition: null,
      source: []
    }

    try {
      // Try multiple free API endpoints
      
      // 1. Try Google Trends API (via RapidAPI - has free tier)
      try {
        const trendResponse = await fetch(
          `https://api.serpapi.com/search?q=${encodeURIComponent(keyword)}&engine=google&gl=ir&hl=fa&api_key=demo`,
          { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        )
        if (trendResponse.ok) {
          const trendData = await trendResponse.json()
          if (trendData.search_information) {
            apiData.searchVolume = Math.min(100, Math.max(1, trendData.search_information.total_results / 1000000))
            apiData.source.push('SerpAPI')
          }
        }
      } catch (e) {
        console.log('SerpAPI not available:', e.message)
      }

      // 2. Try Keyword Tools API endpoint
      try {
        const kwResponse = await fetch(
          `https://api.keywordtoolsio.com/v1/get_keyword_data?keyword=${encodeURIComponent(keyword)}&country=ir&language=fa`,
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        )
        if (kwResponse.ok) {
          const kwData = await kwResponse.json()
          if (kwData.data) {
            apiData.searchVolume = kwData.data.search_volume || apiData.searchVolume
            apiData.difficulty = kwData.data.difficulty || apiData.difficulty
            apiData.source.push('KeywordTools')
          }
        }
      } catch (e) {
        console.log('KeywordTools API not available:', e.message)
      }

      // 3. Try Ubersuggest-like public data
      try {
        const uberResponse = await fetch(
          `https://app.ubersuggest.com/api/v1/keyword/search?keyword=${encodeURIComponent(keyword)}&lang=fa_IR`,
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          }
        )
        if (uberResponse.ok) {
          const uberData = await uberResponse.json()
          if (uberData) {
            apiData.searchVolume = uberData.search_volume || apiData.searchVolume
            apiData.difficulty = uberData.difficulty || apiData.difficulty
            apiData.source.push('Ubersuggest')
          }
        }
      } catch (e) {
        console.log('Ubersuggest not available:', e.message)
      }

    } catch (err) {
      console.error('API fetch error:', err)
    }

    return apiData
  }

  // Hybrid approach: Use APIs with fallback to calculation
  const getKeywordMetrics = async (text) => {
    setLoading(true)
    setError('')

    try {
      // Try to fetch from APIs
      const apiData = await fetchKeywordDataFromAPIs(text)
      
      let searchVolume = apiData.searchVolume
      let difficulty = apiData.difficulty

      // If APIs don't provide data, use calculated estimates as fallback
      if (searchVolume === null) {
        searchVolume = estimateSearchVolumeWithTrends(text)
      } else {
        // Normalize API data to 1-100 scale if needed
        searchVolume = Math.min(100, Math.max(1, searchVolume))
      }

      if (difficulty === null) {
        difficulty = estimateKeywordDifficulty(text)
      } else {
        // Normalize API data to 5-100 scale if needed
        difficulty = Math.min(100, Math.max(5, difficulty))
      }

      return {
        searchVolume,
        difficulty,
        dataSource: apiData.source.length > 0 ? apiData.source.join(', ') : 'Local Algorithm'
      }
    } catch (err) {
      setError('خطا در دریافت داده‌ها، استفاده از تخمین محلی...')
      console.error(err)
      return {
        searchVolume: estimateSearchVolumeWithTrends(text),
        difficulty: estimateKeywordDifficulty(text),
        dataSource: 'Local Algorithm'
      }
    } finally {
      setLoading(false)
    }
  }

  // Get difficulty level label
  const getDifficultyLabel = (score) => {
    if (score <= 20) return { level: 'بسیار آسان', color: '#4ade80', icon: '🎯' }
    if (score <= 40) return { level: 'آسان', color: '#84cc16', icon: '✓' }
    if (score <= 60) return { level: 'متوسط', color: '#eab308', icon: '⚠' }
    if (score <= 80) return { level: 'سخت', color: '#f97316', icon: '⚡' }
    return { level: 'بسیار سخت', color: '#ef4444', icon: '🔥' }
  }

  // Get search volume level label
  const getVolumeLabel = (score) => {
    if (score <= 15) return { level: 'بسیار کم', label: 'Low' }
    if (score <= 35) return { level: 'کم', label: 'Low-Medium' }
    if (score <= 55) return { level: 'متوسط', label: 'Medium' }
    if (score <= 75) return { level: 'زیاد', label: 'High' }
    return { level: 'بسیار زیاد', label: 'Very High' }
  }

  const analyzeKeyword = async () => {
    if (!keyword.trim()) {
      alert('لطفا کلمه کلیدی را وارد کنید')
      return
    }

    const normalized = normalizePersian(keyword)
    const isPersian = isPersianKeyword(normalized)
    
    // Get metrics from APIs or local calculation
    const metrics = await getKeywordMetrics(normalized)
    const opportunity = calculateOpportunity(metrics.difficulty, metrics.searchVolume)

    const analysisResult = {
      keyword: normalized,
      isPersian,
      difficulty: metrics.difficulty,
      volume: metrics.searchVolume,
      opportunity,
      dataSource: metrics.dataSource,
      timestamp: new Date().toLocaleString('fa-IR'),
      difficultyLabel: getDifficultyLabel(metrics.difficulty),
      volumeLabel: getVolumeLabel(metrics.searchVolume),
    }

    setResults(analysisResult)
    setHistory([analysisResult, ...history.slice(0, 9)]) // Keep last 10
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') analyzeKeyword()
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="keyword-analyzer">
      <div className="analyzer-container">
        <div className="analyzer-header">
          <h2>🔍 تحلیل کلمات کلیدی</h2>
          <p className="analyzer-subtitle">تحلیل دشواری و حجم جستجوی کلمات کلیدی فارسی</p>
        </div>

        <div className="analyzer-input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="کلمه کلیدی فارسی را وارد کنید... (مثال: آموزش برنامه نویسی)"
              className="keyword-input"
              dir="rtl"
              disabled={loading}
            />
            <button onClick={analyzeKeyword} className="btn-analyze" disabled={loading}>
              {loading ? 'درحال تحلیل...' : 'تحلیل کنید'}
            </button>
          </div>
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h3>نتایج تحلیل</h3>
              <span className="results-time">{results.timestamp}</span>
            </div>

            <div className="metrics-grid">
              {/* Difficulty Metric */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>دشواری کلمه</h4>
                  <span className="metric-icon">{results.difficultyLabel.icon}</span>
                </div>
                <div className="difficulty-container">
                  <div
                    className="metric-bar"
                    style={{
                      backgroundColor: results.difficultyLabel.color,
                      width: `${results.difficulty}%`,
                    }}
                  />
                  <div className="metric-value">{results.difficulty}</div>
                </div>
                <div className="metric-label" style={{ color: results.difficultyLabel.color }}>
                  {results.difficultyLabel.level}
                </div>
              </div>

              {/* Search Volume Metric */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>حجم جستجو</h4>
                  <span className="metric-icon">📊</span>
                </div>
                <div className="difficulty-container">
                  <div
                    className="metric-bar"
                    style={{
                      backgroundColor: '#3b82f6',
                      width: `${results.volume}%`,
                    }}
                  />
                  <div className="metric-value">{results.volume}</div>
                </div>
                <div className="metric-label" style={{ color: '#3b82f6' }}>
                  {results.volumeLabel.level}
                </div>
              </div>

              {/* Opportunity Score */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>نمره فرصت</h4>
                  <span className="metric-icon">⭐</span>
                </div>
                <div className="difficulty-container">
                  <div
                    className="metric-bar"
                    style={{
                      backgroundColor: '#8b5cf6',
                      width: `${results.opportunity}%`,
                    }}
                  />
                  <div className="metric-value">{results.opportunity.toFixed(1)}</div>
                </div>
                <div className="metric-label" style={{ color: '#8b5cf6' }}>
                  {results.opportunity > 60 ? '🎯 بسیار خوب' : results.opportunity > 40 ? '✓ خوب' : '⚠ ضعیف'}
                </div>
              </div>
            </div>

            <div className="analysis-info">
              <div className="info-item">
                <span className="info-label">کلمه تحلیل شده:</span>
                <span className="info-value">{results.keyword}</span>
              </div>
              <div className="info-item">
                <span className="info-label">نوع کلمه:</span>
                <span className="info-value">{results.isPersian ? '🇮🇷 فارسی' : '🌐 انگلیسی/مختلط'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">تعداد کاراکتر:</span>
                <span className="info-value">{results.keyword.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">منبع داده:</span>
                <span className="info-value" style={{ color: '#667eea' }}>🔗 {results.dataSource}</span>
              </div>
            </div>

            <div className="recommendations">
              <h4>💡 توصیه‌ها:</h4>
              <ul>
                {results.opportunity > 60 && (
                  <li>✅ این کلمه کلیدی فرصت خوبی برای رتبه‌بندی دارد</li>
                )}
                {results.difficulty > 70 && (
                  <li>⚠️ این کلمه بسیار رقابتی است، نیاز به محتوای باکیفیت بالا دارد</li>
                )}
                {results.volume > 70 && (
                  <li>📈 این کلمه جستجوی زیادی دارد، بسیار ارزشمند است</li>
                )}
                {results.volume < 30 && (
                  <li>📉 حجم جستجوی این کلمه کم است، احتمال ترافیک کم</li>
                )}
                {results.keyword.length <= 3 && (
                  <li>📌 کلمات کوتاه معمولا بسیار رقابتی هستند</li>
                )}
                {results.keyword.split(/\s+/).length >= 3 && (
                  <li>🎯 کلمات تخصصی با حجم کم‌تر اما تبدیل‌کننده بیشتری دارند</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>📋 تاریخچه تحلیل‌ها</h3>
              <button onClick={clearHistory} className="btn-clear-history">
                پاک کردن
              </button>
            </div>
            <div className="history-list">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setKeyword(item.keyword)
                    setResults(item)
                  }}
                >
                  <div className="history-keyword">{item.keyword}</div>
                  <div className="history-metrics">
                    <span className="history-metric">
                      دشواری: <strong style={{ color: item.difficultyLabel.color }}>{item.difficulty}</strong>
                    </span>
                    <span className="history-metric">
                      حجم: <strong style={{ color: '#3b82f6' }}>{item.volume}</strong>
                    </span>
                    <span className="history-metric">
                      فرصت: <strong style={{ color: '#8b5cf6' }}>{item.opportunity.toFixed(1)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeywordAnalyzer
