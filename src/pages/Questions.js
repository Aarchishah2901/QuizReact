import React from 'react'
// import Container from '../../node_modules/react-bootstrap/esm/Container';
// import { Next } from '../../node_modules/react-bootstrap/esm/PageItem';

const Questions = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Quiz Question</h1>

      <div className="card shadow-lg">
        <div className="card-body">
          <h5 className="card-title">1. What is today's weather?</h5>
          <div className="mt-4">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="weather" id="normal" />
              <label className="form-check-label" htmlFor="normal">
                Normal
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="weather" id="cold" />
              <label className="form-check-label" htmlFor="cold">
                Cold
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="weather" id="high" />
              <label className="form-check-label" htmlFor="high">
                High
              </label>
            </div>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-success px-4">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Questions;