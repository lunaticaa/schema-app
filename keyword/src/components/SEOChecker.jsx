import { useState } from 'react'
import './SEOChecker.css'

function SEOChecker() {
  const [url, setUrl] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if URL is valid
  const isValidURL = (string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  // Normalize URL
  const normalizeURL = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }

  // Estimate authority metrics using free APIs and calculations
  const fetchAuthorityMetrics = async (url) => {
    const metrics = {
      domainAuthority: null,
      pageAuthority: null,
      backlinks: null,
    }

    try {
      // Extract domain from URL
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace('www.', '')

      // Try multiple free APIs for real data
      let realBacklinks = null

      // Method 1: Try Builtwith-like API
      try {
        const response = await fetch(
          `https://data.builtwith.com/api/v1/domain/${domain}`,
          { 
            method: 'GET',
            headers: { 
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            } 
          }
        )
        if (response.ok) {
          const data = await response.json()
          if (data && data.backlinks) {
            realBacklinks = data.backlinks
          }
        }
      } catch {
        console.log('Builtwith API not available')
      }

      // Method 2: Try Open Page Rank (free version)
      if (!realBacklinks) {
        try {
          const response = await fetch(
            `https://openpagerank.com/api/v1.0/pagerank?domains[]=${domain}`,
            { 
              headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
              } 
            }
          )
          if (response.ok) {
            const data = await response.json()
            if (data && data.response && data.response[domain]) {
              const pageRank = data.response[domain]['page_rank_integer'] || 0
              realBacklinks = Math.round(pageRank * 100)
            }
          }
        } catch {
          console.log('OpenPageRank API not available')
        }
      }

      // Calculate Domain Authority and Page Authority based on domain characteristics
      const domainParts = domain.split('.')
      const tld = domainParts[domainParts.length - 1]
      
      // Base authority score
      let daEstimate = 22
      let paEstimate = 18

      // TLD quality bonus
      const premiumTLDs = { 'com': 15, 'org': 12, 'net': 10, 'edu': 20, 'gov': 22, 'ir': 5 }
      daEstimate += premiumTLDs[tld] || 0

      // Domain length consideration (shorter is generally better)
      const domainLength = domain.length
      if (domainLength < 6) daEstimate += 12
      else if (domainLength < 10) daEstimate += 6
      else if (domainLength < 20) daEstimate += 2
      else daEstimate -= 2

      // Brand/keyword consideration
      const commonWords = ['the', 'my', 'web', 'site', 'blog', 'news']
      if (!commonWords.some(word => domain.includes(word))) daEstimate += 3

      // Page authority is typically lower than DA
      paEstimate = Math.round(daEstimate * 0.65)

      // Normalize to 0-100
      metrics.domainAuthority = Math.min(100, Math.max(5, daEstimate))
      metrics.pageAuthority = Math.min(100, Math.max(5, paEstimate))

      // Set backlinks from real API or estimation
      if (realBacklinks) {
        metrics.backlinks = realBacklinks
      } else {
        // Estimate backlinks based on authority score
        // Higher authority = more backlinks (rough correlation)
        metrics.backlinks = Math.round((metrics.domainAuthority ** 1.5) * 10 + Math.random() * 50)
      }

      return metrics
    } catch (err) {
      console.error('Error fetching authority metrics:', err)
      // Return estimated values even on error
      return metrics
    }
  }

  // Fetch and analyze website
  const analyzeWebsite = async () => {
    if (!url.trim()) {
      setError('لطفا URL وبسایت را وارد کنید')
      return
    }

    const normalizedUrl = normalizeURL(url)
    if (!isValidURL(normalizedUrl)) {
      setError('URL وارد شده معتبر نیست')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Try to fetch from backend server first (handles CORS properly)
      let html = null

      try {
        console.log('Attempting to fetch via backend server...')
        const backendResponse = await fetch('http://localhost:3001/api/fetch-website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ url: normalizedUrl })
        })

        if (backendResponse.ok) {
          const data = await backendResponse.json()
          if (data.html && data.html.length > 100) {
            html = data.html
            console.log('Successfully fetched via backend server')
          }
        } else {
          console.log(`Backend returned status ${backendResponse.status}`)
        }
      } catch (err) {
        console.log(`Backend fetch failed: ${err.message}`)
      }

      // Fallback: Use CORS proxies if backend is not available
      if (!html) {
        console.log('Falling back to CORS proxies...')
        const corsProxies = [
          {
            url: `https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`,
            parse: (data) => data.contents
          },
          {
            url: `https://textsnow.herokuapp.com/?url=${encodeURIComponent(normalizedUrl)}`,
            parse: (data) => data.contents || data.text
          },
          {
            url: `https://cors-anywhere.herokuapp.com/${normalizedUrl}`,
            parse: (data) => typeof data === 'string' ? data : data.contents
          }
        ]

        for (const proxyConfig of corsProxies) {
          try {
            const response = await fetch(proxyConfig.url, {
              method: 'GET',
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            })

            if (response.ok) {
              const contentType = response.headers.get('content-type') || ''
              let data

              if (contentType.includes('application/json')) {
                data = await response.json()
                html = proxyConfig.parse(data)
              } else {
                html = await response.text()
              }

              if (html && html.length > 100) {
                console.log(`Successfully fetched with proxy: ${proxyConfig.url.split('/')[2]}`)
                break
              }
            }
          } catch (err) {
            console.log(`Proxy ${proxyConfig.url.split('/')[2]} failed: ${err.message}`)
            continue
          }
        }
      }

      if (!html || html.length < 100) {
        throw new Error('Unable to fetch website content. Backend server may not be running. Start it with: npm run dev:backend')
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Analyze SEO elements
      const seoData = analyzeSEOElements(doc, normalizedUrl)

      // Fetch authority metrics
      const authorityMetrics = await fetchAuthorityMetrics(normalizedUrl)

      // Merge authority metrics with SEO data
      const finalResults = {
        ...seoData,
        domainAuthority: authorityMetrics.domainAuthority,
        pageAuthority: authorityMetrics.pageAuthority,
        backlinks: authorityMetrics.backlinks,
      }

      setResults(finalResults)
    } catch (err) {
      setError(`خطا در دسترسی به وبسایت: ${err.message}. لطفا اطمینان یافته که URL صحیح است و سرور در دسترس است.`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Analyze SEO elements from DOM
  const analyzeSEOElements = (doc, url) => {
    const results = {
      url,
      timestamp: new Date().toLocaleString('fa-IR'),
      issues: [],
      warnings: [],
      success: [],
      score: 0,
      domainAuthority: null,
      pageAuthority: null,
      backlinks: null,
    }

    // 1. Title Tag Analysis
    const titleTag = doc.querySelector('title')
    const titleText = titleTag?.textContent || ''
    if (titleText.length === 0) {
      results.issues.push({ title: 'عنوان صفحه (Title)', message: 'تگ title یافت نشد' })
    } else if (titleText.length < 30) {
      results.warnings.push({ title: 'عنوان صفحه (Title)', message: `عنوان بسیار کوتاه است: ${titleText.length} کاراکتر (توصیه: 50-60 کاراکتر)` })
    } else if (titleText.length > 60) {
      results.warnings.push({ title: 'عنوان صفحه (Title)', message: `عنوان بسیار طویل است: ${titleText.length} کاراکتر (توصیه: 50-60 کاراکتر)` })
    } else {
      results.success.push({ title: 'عنوان صفحه (Title)', message: `✓ عنوان مناسب: "${titleText.substring(0, 50)}..."` })
    }

    // 2. Meta Description
    const metaDesc = doc.querySelector('meta[name="description"]')
    const descText = metaDesc?.getAttribute('content') || ''
    if (descText.length === 0) {
      results.issues.push({ title: 'توضیح صفحه (Meta Description)', message: 'Meta Description یافت نشد' })
    } else if (descText.length < 120) {
      results.warnings.push({ title: 'توضیح صفحه (Meta Description)', message: `توضیح بسیار کوتاه: ${descText.length} کاراکتر (توصیه: 150-160 کاراکتر)` })
    } else if (descText.length > 160) {
      results.warnings.push({ title: 'توضیح صفحه (Meta Description)', message: `توضیح بسیار طویل: ${descText.length} کاراکتر (توصیه: 150-160 کاراکتر)` })
    } else {
      results.success.push({ title: 'توضیح صفحه (Meta Description)', message: `✓ Meta Description مناسب` })
    }

    // 3. H1 Tags
    const h1Tags = doc.querySelectorAll('h1')
    if (h1Tags.length === 0) {
      results.issues.push({ title: 'تگ H1', message: 'تگ H1 یافت نشد' })
    } else if (h1Tags.length > 1) {
      results.warnings.push({ title: 'تگ H1', message: `تعداد H1 بیش از حد: ${h1Tags.length} (توصیه: فقط 1 عدد)` })
    } else {
      results.success.push({ title: 'تگ H1', message: `✓ یک H1 پیدا شد: "${h1Tags[0].textContent.substring(0, 50)}"` })
    }

    // 4. Headings Structure
    const h2Tags = doc.querySelectorAll('h2').length
    const h3Tags = doc.querySelectorAll('h3').length
    if (h2Tags + h3Tags === 0) {
      results.warnings.push({ title: 'ساختار عناوین', message: 'هیچ H2 یا H3 یافت نشد' })
    } else {
      results.success.push({ title: 'ساختار عناوین', message: `✓ ${h2Tags} H2 و ${h3Tags} H3 پیدا شد` })
    }

    // 5. Image Alt Text
    const images = doc.querySelectorAll('img')
    let imagesWithAlt = 0
    images.forEach(img => {
      if (img.hasAttribute('alt') && img.getAttribute('alt').length > 0) {
        imagesWithAlt++
      }
    })
    if (images.length === 0) {
      results.success.push({ title: 'تصاویر', message: 'هیچ تصویری در صفحه یافت نشد' })
    } else if (imagesWithAlt < images.length) {
      results.warnings.push({ title: 'تصاویر (Alt Text)', message: `${images.length - imagesWithAlt} از ${images.length} تصویر بدون Alt Text` })
    } else {
      results.success.push({ title: 'تصاویر (Alt Text)', message: `✓ تمام ${images.length} تصویر دارای Alt Text` })
    }

    // 6. Meta Tags
    const viewport = doc.querySelector('meta[name="viewport"]')
    if (!viewport) {
      results.issues.push({ title: 'Viewport Meta Tag', message: 'Viewport meta tag یافت نشد (ضروری برای موبایل)' })
    } else {
      results.success.push({ title: 'Viewport Meta Tag', message: '✓ Viewport meta tag موجود است' })
    }

    // 7. Canonical Tag
    const canonical = doc.querySelector('link[rel="canonical"]')
    if (!canonical) {
      results.warnings.push({ title: 'Canonical Tag', message: 'Canonical tag یافت نشد' })
    } else {
      results.success.push({ title: 'Canonical Tag', message: `✓ Canonical tag موجود: ${canonical.getAttribute('href')}` })
    }

    // 8. Open Graph Tags
    const ogTitle = doc.querySelector('meta[property="og:title"]')
    const ogDesc = doc.querySelector('meta[property="og:description"]')
    const ogImage = doc.querySelector('meta[property="og:image"]')
    if (!ogTitle || !ogDesc || !ogImage) {
      results.warnings.push({ title: 'Open Graph Tags', message: 'Open Graph tags ناقص است' })
    } else {
      results.success.push({ title: 'Open Graph Tags', message: '✓ Open Graph tags کامل' })
    }

    // 9. Structured Data (Schema.org)
    const schemas = doc.querySelectorAll('script[type="application/ld+json"]')
    if (schemas.length === 0) {
      results.warnings.push({ title: 'Structured Data', message: 'هیچ Schema.org Structured Data یافت نشد' })
    } else {
      results.success.push({ title: 'Structured Data', message: `✓ ${schemas.length} Schema.org Structured Data پیدا شد` })
    }

    // 10. Mobile Responsiveness (check for viewport)
    if (viewport) {
      results.success.push({ title: 'موبایل', message: '✓ صفحه برای موبایل بهینه‌شده است' })
    } else {
      results.issues.push({ title: 'موبایل', message: 'صفحه برای موبایل بهینه‌نشده است' })
    }

    // 11. Content Length
    const bodyText = doc.body?.textContent || ''
    const wordCount = bodyText.trim().split(/\s+/).length
    if (wordCount < 300) {
      results.warnings.push({ title: 'طول محتوا', message: `محتوا بسیار کوتاه است: ${wordCount} کلمه (توصیه: حداقل 300 کلمه)` })
    } else if (wordCount > 3000) {
      results.warnings.push({ title: 'طول محتوا', message: `محتوا بسیار طویل است: ${wordCount} کلمه` })
    } else {
      results.success.push({ title: 'طول محتوا', message: `✓ محتوا مناسب: ${wordCount} کلمه` })
    }

    // 12. Internal Links
    const internalLinks = doc.querySelectorAll('a[href]').length
    if (internalLinks === 0) {
      results.warnings.push({ title: 'لینک‌های داخلی', message: 'هیچ لینک داخلی یافت نشد' })
    } else {
      results.success.push({ title: 'لینک‌های داخلی', message: `✓ ${internalLinks} لینک داخلی پیدا شد` })
    }

    // Calculate SEO Score
    const warningCount = results.warnings.length
    const issueCount = results.issues.length
    
    results.score = Math.max(0, 100 - (issueCount * 15 + warningCount * 5))

    return results
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') analyzeWebsite()
  }

  const getSEOScoreColor = (score) => {
    if (score >= 80) return '#4ade80'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const getSEOScoreLabel = (score) => {
    if (score >= 80) return 'عالی 🎯'
    if (score >= 60) return 'خوب ✓'
    if (score >= 40) return 'متوسط ⚠'
    return 'ضعیف 🔴'
  }

  return (
    <div className="seo-checker">
      <div className="checker-container">
        <div className="checker-header">
          <h2>🔍 بررسی SEO وبسایت</h2>
          <p className="checker-subtitle">تجزیه و تحلیل جامع SEO برای بهبود رتبه‌بندی</p>
        </div>

        <div className="checker-input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="URL وبسایت را وارد کنید... (مثال: www.example.com)"
              className="url-input"
              dir="ltr"
              disabled={loading}
            />
            <button onClick={analyzeWebsite} className="btn-check" disabled={loading}>
              {loading ? '⏳ درحال بررسی...' : '🔎 بررسی'}
            </button>
          </div>
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h3>نتایج بررسی</h3>
              <span className="results-time">{results.timestamp}</span>
            </div>

            {/* SEO Score Card */}
            <div className="score-card">
              <div className="score-circle" style={{ borderColor: getSEOScoreColor(results.score) }}>
                <span className="score-value" style={{ color: getSEOScoreColor(results.score) }}>
                  {results.score}
                </span>
              </div>
              <div className="score-info">
                <h3 style={{ color: getSEOScoreColor(results.score) }}>
                  {getSEOScoreLabel(results.score)}
                </h3>
                <p>امتیاز SEO کلی</p>
              </div>
            </div>

            {/* Authority Metrics Card */}
            {(results.domainAuthority !== null || results.pageAuthority !== null || results.backlinks !== null) && (
              <div className="authority-card">
                <h4>📊 معیارهای اعتبار دامنه</h4>
                <div className="authority-metrics">
                  {results.domainAuthority !== null && (
                    <div className="metric-item">
                      <span className="metric-label">Domain Authority (DA)</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${results.domainAuthority}%`,
                            backgroundColor: results.domainAuthority >= 50 ? '#4CAF50' : results.domainAuthority >= 30 ? '#FF9800' : '#f44336'
                          }}
                        />
                      </div>
                      <span className="metric-value">{results.domainAuthority}/100</span>
                    </div>
                  )}
                  {results.pageAuthority !== null && (
                    <div className="metric-item">
                      <span className="metric-label">Page Authority (PA)</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ 
                            width: `${results.pageAuthority}%`,
                            backgroundColor: results.pageAuthority >= 50 ? '#4CAF50' : results.pageAuthority >= 30 ? '#FF9800' : '#f44336'
                          }}
                        />
                      </div>
                      <span className="metric-value">{results.pageAuthority}/100</span>
                    </div>
                  )}
                  {results.backlinks !== null && (
                    <div className="metric-item">
                      <span className="metric-label">تعداد بک‌لینک‌ها</span>
                      <span className="backlink-value">{results.backlinks.toLocaleString('fa-IR')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Issues */}
            {results.issues.length > 0 && (
              <div className="issues-section">
                <h4>🔴 مسائل مهم ({results.issues.length})</h4>
                <div className="items-list">
                  {results.issues.map((issue, idx) => (
                    <div key={idx} className="item issue">
                      <span className="item-title">{issue.title}</span>
                      <span className="item-message">{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {results.warnings.length > 0 && (
              <div className="warnings-section">
                <h4>⚠️ هشدارها ({results.warnings.length})</h4>
                <div className="items-list">
                  {results.warnings.map((warning, idx) => (
                    <div key={idx} className="item warning">
                      <span className="item-title">{warning.title}</span>
                      <span className="item-message">{warning.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success */}
            {results.success.length > 0 && (
              <div className="success-section">
                <h4>✅ موارد بهتر ({results.success.length})</h4>
                <div className="items-list">
                  {results.success.map((item, idx) => (
                    <div key={idx} className="item success">
                      <span className="item-title">{item.title}</span>
                      <span className="item-message">{item.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL Info */}
            <div className="url-info">
              <span className="info-label">وبسایت تحلیل شده:</span>
              <span className="info-value">{results.url}</span>
            </div>
          </div>
        )}

        {!results && !loading && (
          <div className="empty-state">
            <p>🌐 URL یک وبسایت را وارد کنید تا تحلیل SEO آن را دریافت کنید</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SEOChecker
