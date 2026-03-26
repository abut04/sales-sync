import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

function Prediction() {
  const [logs, setLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!auth.currentUser) return;

        const q = query(
          collection(db, "performance_logs"),
          where("userId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setLogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);

  const getPrediction = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ logs })
      });

      const data = await response.json();

      setPrediction(data.prediction);
      setConfidence(data.confidence);
    } catch (error) {
      console.error(error);
      alert("Make sure Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const totalLogs = logs.length;
  const totalAcquisitions = logs.reduce((sum, log) => sum + (log.acquisition || 0), 0);
  const totalFlow = logs.reduce((sum, log) => sum + (log.flowSent || 0), 0);
  const totalClosed = logs.reduce((sum, log) => sum + (log.closed || 0), 0);

  const avgAcquisitions = totalLogs > 0 ? (totalAcquisitions / totalLogs).toFixed(1) : "0.0";
  const avgFlow = totalLogs > 0 ? (totalFlow / totalLogs).toFixed(1) : "0.0";
  const avgClosed = totalLogs > 0 ? (totalClosed / totalLogs).toFixed(1) : "0.0";

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px",
    fontFamily: "Arial"
  };

  const containerStyle = {
    maxWidth: "1000px",
    margin: "0 auto"
  };

  const heroCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "25px"
  };

  const statGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "25px"
  };

  const statCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
  };

  const buttonStyle = {
    padding: "14px 22px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  };

  const resultCardStyle = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "14px",
    padding: "22px",
    marginTop: "22px"
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroCardStyle}>
          <h1 style={{ marginBottom: "10px", fontSize: "32px" }}>AI Prediction</h1>
          <p style={{ color: "#475569", marginBottom: "0" }}>
            Use your historical performance data to estimate your next expected acquisition result.
          </p>
        </div>

        {logs.length === 0 ? (
          <div style={heroCardStyle}>
            <p>No data available yet for prediction.</p>
          </div>
        ) : (
          <>
            <div style={statGridStyle}>
              <div style={statCardStyle}>
                <strong>Total Logs</strong>
                <p style={{ fontSize: "24px", marginTop: "10px" }}>{totalLogs}</p>
              </div>

              <div style={statCardStyle}>
                <strong>Average Closed</strong>
                <p style={{ fontSize: "24px", marginTop: "10px" }}>{avgClosed}</p>
              </div>

              <div style={statCardStyle}>
                <strong>Average Flow Sent</strong>
                <p style={{ fontSize: "24px", marginTop: "10px" }}>{avgFlow}</p>
              </div>

              <div style={statCardStyle}>
                <strong>Average Acquisitions</strong>
                <p style={{ fontSize: "24px", marginTop: "10px" }}>{avgAcquisitions}</p>
              </div>
            </div>

            <div style={heroCardStyle}>
              <h2 style={{ marginTop: 0 }}>Run Prediction</h2>
              <p style={{ color: "#475569" }}>
                This sends your past logs to the Python AI service and returns a predicted acquisition value.
              </p>

              <button onClick={getPrediction} style={buttonStyle}>
                {loading ? "Running Prediction..." : "Run AI Prediction"}
              </button>

              {prediction !== null && (
                <div style={resultCardStyle}>
                  <h3 style={{ marginTop: 0 }}>Prediction Result</h3>
                  <p>
                    <strong>Predicted Next Acquisitions:</strong> {prediction}
                  </p>
                  <p>
                    <strong>Model Used:</strong> {confidence}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Prediction;