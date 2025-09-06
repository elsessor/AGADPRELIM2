import { useState } from 'react'
import './App.css'

function App() {
  const [requestData, setRequestData] = useState({
    method: 'GET',
    url: 'https://prelim-exam.onrender.com/signup',
    body: '',
    username: '',
    password: '',
    age: '',
    authKey: '',
    ownerId: '',
    name: '',
    type: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [responseTime, setResponseTime] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    setResponseTime(null)

    const startTime = Date.now()

    try {
      const requestOptions = {
        method: requestData.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      
      if (['POST', 'PUT', 'PATCH'].includes(requestData.method) && requestData.body) {
        try {
          requestOptions.body = requestData.body
        } catch (error) {
          console.error('Invalid JSON body:', error)
        }
      }

      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(requestData.method)) {
        const bodyData = {}
        
        // Only include fields that have values
        if (requestData.username) bodyData.username = requestData.username
        if (requestData.password) bodyData.password = requestData.password
        if (requestData.age) bodyData.age = parseInt(requestData.age) || requestData.age
        if (requestData.authKey) bodyData.authKey = requestData.authKey
        if (requestData.ownerId) bodyData.ownerId = requestData.ownerId
        if (requestData.name) bodyData.name = requestData.name
        if (requestData.type) bodyData.type = requestData.type
        if (requestData.role) bodyData.role = requestData.role
        
        // Only send body if there's actual data
        if (Object.keys(bodyData).length > 0) {
          requestOptions.body = JSON.stringify(bodyData)
        }
      }

      const response = await fetch(requestData.url, requestOptions)
      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      const responseText = await response.text()
      
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      // Log the request details for debugging
      console.log('Request URL:', requestData.url)
      console.log('Request Method:', requestData.method)
      console.log('Request Body:', requestOptions.body)
      console.log('Response Status:', response.status)
      console.log('Response Data:', responseData)

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        size: responseText.length
      })
    } catch (error) {
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      setResponse({
        error: true,
        message: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const formatHeaders = (headers) => {
    return Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n')
  }

  const formatResponse = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2)
    }
    return data
  }

  return (

      <div className="app-container">
      <div className="postman-container">
        <div className="postman-header">
          <h1>Agad_Prelims</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="postman-form">
          <div className="request-section">
            <div className="method-url-row">
              <div className="method-select-container">
                <select
                  name="method"
                  value={requestData.method}
                  onChange={handleInputChange}
                  className="method-select"
                  disabled={loading}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <input
                type="url"
                name="url"
                value={requestData.url}
                onChange={handleInputChange}
                placeholder="Enter URL"
                className="url-input"
                required
                disabled={loading}
              />
              
              <button 
                type="submit" 
                className="send-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>

            {['POST', 'PUT', 'PATCH'].includes(requestData.method) && (
              <div className="body-section">
                <div className="login-form-fields">
                  <div className="form-field">
                    <label htmlFor="username">Username (Surname)</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={requestData.username || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                      placeholder="Enter your surname"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={requestData.password || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        password: e.target.value
                      }))}
                      placeholder="Enter your password"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={requestData.age || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        age: e.target.value
                      }))}
                      placeholder="Enter your age"
                      className="form-input"
                      disabled={loading}
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="authKey">Authentication Key (Code Number)</label>
                    <input
                      type="text"
                      id="authKey"
                      name="authKey"
                      value={requestData.authKey || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        authKey: e.target.value
                      }))}
                      placeholder="Enter authentication key"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ownerId">Owner ID</label>
                    <input
                      type="text"
                      id="ownerId"
                      name="ownerId"
                      value={requestData.ownerId || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        ownerId: e.target.value
                      }))}
                      placeholder="Enter owner ID"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="name">Pet Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={requestData.name || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      placeholder="Enter name"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="type">Pet Type</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={requestData.type || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        type: e.target.value
                      }))}
                      placeholder="Enter type"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={requestData.role || ''}
                      onChange={(e) => setRequestData(prev => ({
                        ...prev,
                        role: e.target.value
                      }))}
                      placeholder="Enter role"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {response && (
            <div className="response-section">
              <div className="response-header">
                <h3>Response</h3>
                {responseTime && <span className="response-time">{responseTime}ms</span>}
              </div>
              
              {response.error ? (
                <div className="error-response">
                  <p><strong>Error:</strong> {response.message}</p>
                </div>
              ) : (
                <div className="success-response">
                  <div className="response-status">
                    <span className={`status-badge ${response.status >= 200 && response.status < 300 ? 'success' : 'error'}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="response-size">{response.size} bytes</span>
                  </div>
                  
                  <div className="response-headers">
                    <h4>Response Headers:</h4>
                    <pre>{formatHeaders(response.headers)}</pre>
                  </div>
                  
                  <div className="response-body">
                    <h4>Response Body:</h4>
                    <pre>{formatResponse(response.data)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default App
