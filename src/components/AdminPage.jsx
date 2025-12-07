import React, { useState } from "react";
import { evmData } from "../data/evmData";

function AdminPage() {
  const [formData, setFormData] = useState({
    district: "demo",
    blockName: "demo",
    blockCode: "demo",
    panchayatId: "",
    panchayatName: "",
    wardNo: "",
    wardName: "",
    ballotUnit: "101",
    blockDivision: "Kannur-05",
    districtDivision: "Kannur",
    // Ward level
    wardLevel: "Ward",
    wardTitle: "Vote for",
    wardCandidates: [
      { id: 1, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 2, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 3, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 4, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 5, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 6, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 7, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 8, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 9, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
    ],
    // Block level
    blockLevel: "Block",
    blockTitle: "Vote for",
    blockName: "",
    blockCandidates: [
      { id: 1, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 2, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 3, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 4, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 5, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 6, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 7, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 8, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 9, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
    ],
    // District level
    districtLevel: "District",
    districtTitle: "Vote for",
    districtName: "",
    districtCandidates: [
      { id: 1, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 2, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 3, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 4, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 5, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 6, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 7, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 8, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
      { id: 9, name: "", symbol: "", successSymbol: "", candidateImgName: "" },
    ],
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCandidate = (level) => {
    const fieldName = `${level.toLowerCase()}Candidates`;
    const newId = formData[fieldName].length + 1;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [
        ...prev[fieldName],
        {
          id: newId,
          name: "",
          symbol: "",
          successSymbol: "",
          candidateImgName: "",
        },
      ],
    }));
  };

  const updateCandidate = (level, index, field, value) => {
    const fieldName = `${level.toLowerCase()}Candidates`;
    const updated = [...formData[fieldName]];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: updated,
    }));
  };

  const removeCandidate = (level, index) => {
    const fieldName = `${level.toLowerCase()}Candidates`;
    const filtered = formData[fieldName].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: filtered,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the new ward data structure
    const newWardData = {
      wardNo: parseInt(formData.wardNo),
      name: formData.wardName,
      ballotUnit: formData.ballotUnit,
      blockDivision: formData.blockDivision,
      districtDivision: formData.districtDivision,
      Ward: {
        level: formData.wardLevel,
        title: formData.wardTitle,
        candidates: formData.wardCandidates,
      },
      Block: {
        level: formData.blockLevel,
        title: formData.blockTitle,
        name: formData.blockName,
        candidates: formData.blockCandidates,
      },
      District: {
        level: formData.districtLevel,
        title: formData.districtTitle,
        name: formData.districtName,
        candidates: formData.districtCandidates,
      },
    };

    // Generate the JavaScript code
    const dataToSave = {
      district: formData.district,
      blockName: formData.blockName,
      blockCode: formData.blockCode,
      panchayatId: parseInt(formData.panchayatId),
      panchayatName: formData.panchayatName,
      wardData: newWardData,
    };

    // Display the generated code
    const generatedCode = `
// Add this ward to the appropriate panchayat in evmData.js
// District: ${dataToSave.district}
// Block: ${dataToSave.blockName} (${dataToSave.blockCode})
// Panchayat: ${dataToSave.panchayatName} (ID: ${dataToSave.panchayatId})

${JSON.stringify(newWardData, null, 2)}
`;

    setMessage(generatedCode);

    // Download as JSON file
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ward-${formData.panchayatId}-${formData.wardNo}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderCandidateForm = (level, candidates) => {
    const fieldName = `${level.toLowerCase()}Candidates`;

    return (
      <div className="candidate-section">
        <h3>{level} Level Candidates</h3>
        {candidates.map((candidate, index) => (
          <div key={index} className="candidate-form">
            <h4>Candidate {index + 1}</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Candidate Name"
                value={candidate.name}
                onChange={(e) =>
                  updateCandidate(level, index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Symbol (e.g., cpim.jpeg)"
                value={candidate.symbol}
                onChange={(e) =>
                  updateCandidate(level, index, "symbol", e.target.value)
                }
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Success Symbol (e.g., cpim-success.png)"
                value={candidate.successSymbol}
                onChange={(e) =>
                  updateCandidate(level, index, "successSymbol", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Candidate Image (e.g., name.jpeg)"
                value={candidate.candidateImgName}
                onChange={(e) =>
                  updateCandidate(
                    level,
                    index,
                    "candidateImgName",
                    e.target.value
                  )
                }
              />
            </div>
            {candidates.length > 1 && (
              <button
                type="button"
                onClick={() => removeCandidate(level, index)}
                className="remove-btn"
              >
                Remove Candidate
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCandidate(level)}
          className="add-btn"
        >
          Add {level} Candidate
        </button>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>EVM Data Admin Panel</h1>
        <a href="/" className="back-link">
          ← Back to Home
        </a>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <section className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                placeholder="e.g., Kasaragod"
              />
            </div>
            <div className="form-group">
              <label>Block Name</label>
              <input
                type="text"
                name="blockName"
                value={formData.blockName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Kanhangad"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Block Code</label>
              <input
                type="text"
                name="blockCode"
                value={formData.blockCode}
                onChange={handleInputChange}
                required
                placeholder="e.g., Kanhangad-05"
              />
            </div>
            <div className="form-group">
              <label>Panchayat ID</label>
              <input
                type="number"
                name="panchayatId"
                value={formData.panchayatId}
                onChange={handleInputChange}
                required
                placeholder="e.g., 1421"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Panchayat Name</label>
              <input
                type="text"
                name="panchayatName"
                value={formData.panchayatName}
                onChange={handleInputChange}
                required
                placeholder="e.g., കല്ല്യാശ്ശേരി പഞ്ചായത്ത്"
              />
            </div>
            <div className="form-group">
              <label>Ward Number</label>
              <input
                type="number"
                name="wardNo"
                value={formData.wardNo}
                onChange={handleInputChange}
                required
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ward Name</label>
              <input
                type="text"
                name="wardName"
                value={formData.wardName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ballot Unit</label>
              <input
                type="text"
                name="ballotUnit"
                value={formData.ballotUnit}
                onChange={handleInputChange}
                required
                placeholder="e.g., 101"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Block Division</label>
              <input
                type="text"
                name="blockDivision"
                value={formData.blockDivision}
                onChange={handleInputChange}
                required
                placeholder="e.g., Kanhangad-05"
              />
            </div>
            <div className="form-group">
              <label>District Division</label>
              <input
                type="text"
                name="districtDivision"
                value={formData.districtDivision}
                onChange={handleInputChange}
                required
                placeholder="e.g., Kasaragod-12"
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Ward Level</h2>
          <div className="form-group">
            <label>Ward Title</label>
            <input
              type="text"
              name="wardTitle"
              value={formData.wardTitle}
              onChange={handleInputChange}
              required
              placeholder="e.g., Vote For പി കെ മൊയ്തീൻ കുട്ടി"
            />
          </div>
          {renderCandidateForm("Ward", formData.wardCandidates)}
        </section>

        <section className="form-section">
          <h2>Block Level</h2>
          <div className="form-group">
            <label>Block Title</label>
            <input
              type="text"
              name="blockTitle"
              value={formData.blockTitle}
              onChange={handleInputChange}
              required
              placeholder="e.g., Vote For കെ പ്രീത"
            />
          </div>
          <div className="form-group">
            <label>Block Name</label>
            <input
              type="text"
              name="blockName"
              value={formData.blockName}
              onChange={handleInputChange}
              required
              placeholder="e.g., കല്ല്യാശ്ശേരി ബ്ലോക്ക് പഞ്ചായത്ത്-ഇരിണാവ് ഡിവിഷൻ"
            />
          </div>
          {renderCandidateForm("Block", formData.blockCandidates)}
        </section>

        <section className="form-section">
          <h2>District Level</h2>
          <div className="form-group">
            <label>District Title</label>
            <input
              type="text"
              name="districtTitle"
              value={formData.districtTitle}
              onChange={handleInputChange}
              required
              placeholder="e.g., Vote For സി എച് കുഞ്ഞമ്പു"
            />
          </div>
          <div className="form-group">
            <label>District Name</label>
            <input
              type="text"
              name="districtName"
              value={formData.districtName}
              onChange={handleInputChange}
              required
              placeholder="e.g., കാസർഗോഡ് ജില്ലാ പഞ്ചായത്ത്-കല്ല്യാശ്ശേരി ഡിവിഷൻ"
            />
          </div>
          {renderCandidateForm("District", formData.districtCandidates)}
        </section>

        <button type="submit" className="submit-btn">
          Generate & Download Data
        </button>
      </form>

      {message && (
        <div className="output-section">
          <h3>Generated Code:</h3>
          <pre className="code-output">{message}</pre>
          <p className="instruction">
            Copy the ward data above and add it to the appropriate panchayat's
            wards array in evmData.js
          </p>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .admin-header h1 {
          margin: 0;
          color: #333;
        }

        .back-link {
          color: #007bff;
          text-decoration: none;
          font-size: 16px;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .admin-form {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #eee;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h2 {
          color: #333;
          margin-bottom: 20px;
          font-size: 24px;
        }

        .form-section h3 {
          color: #555;
          margin: 20px 0 15px;
          font-size: 18px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 5px;
          font-weight: 600;
          color: #555;
        }

        input[type="text"],
        input[type="number"] {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #007bff;
        }

        .candidate-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 6px;
          margin-top: 15px;
        }

        .candidate-form {
          background: white;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          border: 1px solid #e0e0e0;
        }

        .candidate-form h4 {
          margin: 0 0 10px;
          color: #666;
          font-size: 14px;
        }

        .add-btn,
        .remove-btn,
        .submit-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .add-btn {
          background: #28a745;
          color: white;
          margin-top: 10px;
        }

        .add-btn:hover {
          background: #218838;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
          margin-top: 10px;
        }

        .remove-btn:hover {
          background: #c82333;
        }

        .submit-btn {
          background: #007bff;
          color: white;
          width: 100%;
          padding: 15px;
          font-size: 16px;
          margin-top: 20px;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        .output-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .output-section h3 {
          margin-top: 0;
          color: #333;
        }

        .code-output {
          background: #f4f4f4;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: "Courier New", monospace;
          font-size: 12px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .instruction {
          margin-top: 15px;
          padding: 10px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          color: #856404;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPage;
