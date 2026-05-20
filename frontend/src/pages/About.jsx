import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/about`)
      .then(res => res.json())
      .then(data => setAbout(data))
      .catch(err => {
        setAbout({
          app_name: 'Burme Movie Recap',
          version: '1.0.0',
          description: 'Create stunning recap videos with custom subtitles in minutes',
          tech_stack: {
            frontend: 'React + Vite + Tailwind CSS',
            backend: 'FastAPI (Python)',
            video_processing: 'FFmpeg',
            container: 'Docker'
          },
          font_credit: 'Cloud AI Sans - Designed for Cloud AI platform',
          contact: 'contact@burme.com',
          github: 'https://github.com/burme-recap'
        })
      })
  }, [])

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="glass rounded-4 p-4">
            {/* Header */}
            <div className="text-center mb-4">
              <i className="bi bi-camera-reels display-1 text-danger"></i>
              <h2 className="mt-3">{about?.app_name || 'Burme Movie Recap'}</h2>
              <p className="text-danger fw-bold">Version {about?.version || '1.0.0'}</p>
            </div>

            {/* Description */}
            <div className="bg-dark rounded-3 p-3 mb-4">
              <p>{about?.description || 'Create stunning recap videos with custom subtitles in minutes'}</p>
            </div>

            {/* Tech Stack */}
            <div className="mb-4">
              <h5 className="mb-3"><i className="bi bi-tools me-2"></i>Tech Stack</h5>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-secondary">
                  <i className="bi bi-code-slash me-1"></i>
                  {about?.tech_stack?.frontend || 'React'}
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-filetype-py me-1"></i>
                  {about?.tech_stack?.backend || 'FastAPI'}
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-film me-1"></i>
                  {about?.tech_stack?.video_processing || 'FFmpeg'}
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-box-seam me-1"></i>
                  {about?.tech_stack?.container || 'Docker'}
                </span>
              </div>
            </div>

            {/* Font Credit */}
            <div className="mb-4">
              <h5 className="mb-3"><i className="bi bi-type me-2"></i>Font Credit</h5>
              <div className="bg-dark rounded-3 p-3">
                <p className="mb-0">"{about?.font_credit || 'Cloud AI Sans - Designed for Cloud AI platform'}"</p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-4">
              <h5 className="mb-3"><i className="bi bi-link-45deg me-2"></i>Links</h5>
              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-envelope me-2"></i>
                  {about?.contact || 'contact@burme.com'}
                </a>
                <a href="#" className="text-light text-decoration-none">
                  <i className="bi bi-github me-2"></i>
                  GitHub: {about?.github || '/burme-recap'}
                </a>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button className="btn btn-primary" onClick={() => window.history.back()}>
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About