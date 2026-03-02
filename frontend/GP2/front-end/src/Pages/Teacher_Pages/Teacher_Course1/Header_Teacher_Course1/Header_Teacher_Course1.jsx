import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { auth, db } from "../../../../Config/firebaseConfig";
import axios from "axios";
import jsPDF from "jspdf";
import "./Header_Teacher_Course1.css";

const Header_Teacher_Course1 = () => {
  const { subject, grade } = useParams();
  const [teacherId, setTeacherId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [charts, setCharts] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setTeacherId(user.uid);
    else setError("Please log in to upload recordings");
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setStatusMessage("");
      setEngagement(null);
      setCharts(null);
      setPdfUrl(null);
    }
  };

  const generatePdfReport = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Engagement Report`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Subject: ${subject}`, 20, 30);
    doc.text(`Grade: ${grade}`, 20, 40);
    doc.text(`Teacher ID: ${teacherId}`, 20, 50);
    doc.text(`Engagement: ${data.engagement}%`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 70);

    let y = 90;
    const addImageToPdf = (imageData, title) => {
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 5;
      doc.addImage(imageData, "PNG", 20, y, 160, 90);
      y += 100;
    };

    addImageToPdf(`data:image/png;base64,${data.pie_chart}`, "Engagement Distribution");
    //addImageToPdf(`data:image/png;base64,${data.line_chart}`, "Engagement Over Time");
    addImageToPdf(`data:image/png;base64,${data.smooth_chart}`, "Engagement Over Time");

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    setPdfUrl(blobUrl);
  };

  const handleUploadRecord = async () => {
    if (!teacherId) return setError("Error: No teacher ID found. Please log in.");
    if (!selectedFile) return setError("Please choose a video file.");

    setUploadProgress(1);
    setStatusMessage("📤 Uploading video for analysis...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("teacher_id", teacherId);
      formData.append("subject", subject);
      formData.append("grade", grade);

      const response = await axios.post("http://localhost:8000/upload-video/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      if (response.data.error) throw new Error(response.data.error);

      const data = response.data;
      const sessionRef = push(ref(db, "classroom_sessions"));

      await set(sessionRef, {
        teacherId,
        subject,
        grade,
        engagement: data.engagement,
        timestamp: new Date().toISOString(),
      });

      setEngagement(data.engagement);
      setCharts({ pie: data.pie_chart, line: data.line_chart, smooth: data.smooth_chart });
      generatePdfReport(data);
      setStatusMessage("✅ Analysis complete! Results saved.");
    } catch (err) {
      console.error("Upload/Analysis error:", err);
      setError(err.message || "❌ Something went wrong. Try again.");
    } finally {
      setUploadProgress(0);
    }
  };

  return (
    <div className="teacher-container">
      <h1 className="course-title">{`${subject} - ${grade}`}</h1>

      <div className="upload-section">
        <h2 className="reports-title">Upload Recording</h2>
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>

      {uploadProgress > 0 && (
        <div className="progress-container">
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      <button
        className="upload-analyze-button"
        onClick={handleUploadRecord}
        disabled={!selectedFile || uploadProgress > 0}
      >
        {uploadProgress > 0 ? "Processing..." : "Upload & Analyze"}
      </button>

      {engagement && charts && (
        <div className="analysis-results">
          <h3>Engagement Analysis Complete</h3>
          <p className="overall-engagement"> <strong>Overall Engagement:</strong> {engagement}%</p>

          {pdfUrl && (
            <div className="pdf-preview">
              <h4>📄 Preview Report</h4>
              <div className="pdf-frame-wrapper">
                <iframe
                  src={pdfUrl}
                  title="Engagement Report"
                  allowFullScreen
                />
              </div>
              <a
                href={pdfUrl}
                download={`Engagement_Report_${subject}_${grade}_${new Date().toLocaleString()}.pdf`}
                className="download-link"
              >Download</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header_Teacher_Course1;