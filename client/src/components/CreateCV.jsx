import React, { useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const CreateCV = ({ setResult }) => {
  const [fullName, setFullName] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [currentLength, setCurrentLength] = useState(1);
  const [currentTechnologies, setCurrentTechnologies] = useState("");
  const [headshot, setHeadshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyInfo, setCompanyInfo] = useState([{ name: "", position: "" }]);
  const [englishChecked, setEnglishChecked] = useState(false);
  const [frenchChecked, setFrenchChecked] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("headshotImage", headshot, headshot.name);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("currentPosition", currentPosition);
    formData.append("currentLength", currentLength);
    formData.append("currentTechnologies", currentTechnologies);
    formData.append("jobDesc", jobDesc);
    formData.append("workHistory", JSON.stringify(companyInfo));
    formData.append("englishChecked", englishChecked);
    formData.append("frenchChecked", frenchChecked);
    const token = localStorage.getItem("resume_server_jwt_token");
    if (englishChecked) {
      axios
        .post(`${apiUrl}/resume/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        })
        .then((res) => {
          if (res.data.message) {
            setResult(res.data.data);
            navigate("/resume");
          }
        })
        .catch((err) => console.error(err));
    } else if (frenchChecked) {
      axios.post(`${apiUrl}/resume/createFr`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }).then((res) => {
        if (res.data.message) {
          setResult(res.data.data);
          navigate("/resume");
        }
      });
    }
    setLoading(true);
  };
  //👇🏻 Renders the Loading component you submit the form
  if (loading) {
    return <Loading />;
  }
  //👇🏻 updates the state with user's input
  const handleAddCompany = () =>
    setCompanyInfo([...companyInfo, { name: "", position: "" }]);

  //👇🏻 removes a selected item from the list
  const handleRemoveCompany = (index) => {
    const list = [...companyInfo];
    list.splice(index, 1);
    setCompanyInfo(list);
  };
  //👇🏻 updates an item within the list
  const handleUpdateCompany = (e, index) => {
    const { name, value } = e.target;
    const list = [...companyInfo];
    list[index][name] = value;
    setCompanyInfo(list);
  };
  const handleCheckboxChange = (language) => {
    if (language === "english") {
      setEnglishChecked(!englishChecked);
      setFrenchChecked(false);
    } else if (language === "french") {
      setFrenchChecked(!frenchChecked);
      setEnglishChecked(false);
    }
    console.log(language);
    // onLanguageChange(language);
  };
  return (
    <div
      className="app"
      style={{
        background: "#ecf0f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#3498db", textAlign: "center" }}>
          Resume Builder
        </h1>
        <p style={{ color: "#555", textAlign: "center", marginBottom: "20px" }}>
          Generate a resume with ChatGPT in few seconds
        </p>
        <form
          onSubmit={handleFormSubmit}
          method="POST"
          encType="multipart/form-data"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <label
            htmlFor="fullName"
            style={{ marginTop: "20px", display: "block", fontWeight: "bold" }}
          >
            Full name
          </label>
          <input
            type="text"
            required
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <label
            htmlFor="email"
            style={{ marginTop: "20px", display: "block", fontWeight: "bold" }}
          >
            Email Address
          </label>
          <input
            type="email"
            required
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <div className="nestedContainer" style={{ marginBottom: "20px" }}>
            <div>
              <label htmlFor="currentPosition">Current Position</label>
              <input
                type="text"
                required
                name="currentPosition"
                className="currentInput"
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="currentLength">Years of experience</label>
              <input
                type="number"
                required
                name="currentLength"
                className="currentInput"
                value={currentLength}
                onChange={(e) => setCurrentLength(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="currentTechnologies">Technologies used</label>
              <input
                type="text"
                required
                name="currentTechnologies"
                className="currentInput"
                value={currentTechnologies}
                onChange={(e) => setCurrentTechnologies(e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="photo">Upload your headshot image</label>
          <input
            type="file"
            name="photo"
            required
            id="photo"
            accept="image/x-png,image/jpeg"
            onChange={(e) => setHeadshot(e.target.files[0])}
          />
          <h3>Work Experience:</h3>
          {companyInfo.map((company, index) => (
            <div className="nestedContainer" key={index}>
              <div className="companies">
                <label htmlFor="name">Company Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={(e) => handleUpdateCompany(e, index)}
                />
              </div>
              <div className="companies">
                <label htmlFor="position">Position Held</label>
                <input
                  type="text"
                  name="position"
                  required
                  onChange={(e) => handleUpdateCompany(e, index)}
                />
              </div>

              <div className="btn__group">
                {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                  <button
                    id="addBtn"
                    onClick={handleAddCompany}
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Add
                  </button>
                )}
                {companyInfo.length > 1 && (
                  <button
                    id="deleteBtn"
                    onClick={() => handleRemoveCompany(index)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      padding: "8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          <label>Enter job description you are applying for:</label>
          <input
            type="text"
            name="jobDesc"
            required
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <h3>Please select a language for your resume:</h3>
          {/*<label htmlFor="languageEn">English</label>
          <input type="checkbox" required id="languageEn" />
          <label htmlFor="languageFr">French</label>
          <input type="checkbox" required id="languageFr" />*/}
          <div>
            <label>
              <input
                type="checkbox"
                checked={englishChecked}
                onChange={() => handleCheckboxChange("english")}
              />
              English
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={frenchChecked}
                onChange={() => handleCheckboxChange("french")}
              />
              French
            </label>
          </div>
          <button
            style={{
              backgroundColor: "#2ecc71",
              color: "white",
              padding: "12px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
            }}
          >
            CREATE RESUME
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCV;
