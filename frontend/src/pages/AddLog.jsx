import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

function AddLog() {
  const [form, setForm] = useState({
    date: "",
    hoursWorked: "",
    doorsKnocked: "",
    spokenTo: "",
    presented: "",
    closed: "",
    flowSent: "",
    acquisition: "",
    notes: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "performance_logs"), {
        userId: auth.currentUser?.uid || "unknown",
        date: form.date,
        hoursWorked: Number(form.hoursWorked),
        doorsKnocked: Number(form.doorsKnocked),
        spokenTo: Number(form.spokenTo),
        presented: Number(form.presented),
        closed: Number(form.closed),
        flowSent: Number(form.flowSent),
        acquisition: Number(form.acquisition),
        notes: form.notes,
        createdAt: new Date()
      });

      alert("Log added successfully!");

      setForm({
        date: "",
        hoursWorked: "",
        doorsKnocked: "",
        spokenTo: "",
        presented: "",
        closed: "",
        flowSent: "",
        acquisition: "",
        notes: ""
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px",
    fontFamily: "Arial"
  };

  const cardStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  };

  const titleStyle = {
    marginBottom: "10px",
    fontSize: "32px"
  };

  const subtitleStyle = {
    marginBottom: "30px",
    color: "#475569"
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    marginBottom: "15px",
    marginTop: "10px"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  };

  const fieldWrapStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  };

  const labelStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#1e293b"
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none"
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "110px",
    resize: "vertical"
  };

  const helperRowStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "28px"
  };

  const helperCardStyle = {
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
    padding: "14px",
    border: "1px solid #bfdbfe"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer"
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Add Performance Log</h1>
        <p style={subtitleStyle}>
          Record your daily sales activity clearly and consistently.
        </p>

        <div style={helperRowStyle}>
          <div style={helperCardStyle}>
            <strong>Closed</strong>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px" }}>
              Reached the yes/no decision stage.
            </p>
          </div>

          <div style={helperCardStyle}>
            <strong>Flow Sent</strong>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px" }}>
              Form or sign-up process sent after the close.
            </p>
          </div>

          <div style={helperCardStyle}>
            <strong>Acquisitions</strong>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px" }}>
              Fully completed sign-up or sale.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 style={sectionTitleStyle}>Session Details</h2>
          <div style={gridStyle}>
            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Hours Worked</label>
              <input
                type="number"
                name="hoursWorked"
                placeholder="e.g. 6"
                value={form.hoursWorked}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Performance Funnel</h2>
          <div style={gridStyle}>
            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Doors Knocked</label>
              <input
                type="number"
                name="doorsKnocked"
                placeholder="e.g. 120"
                value={form.doorsKnocked}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>People Spoken To</label>
              <input
                type="number"
                name="spokenTo"
                placeholder="e.g. 50"
                value={form.spokenTo}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Presented</label>
              <input
                type="number"
                name="presented"
                placeholder="e.g. 10"
                value={form.presented}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Closed</label>
              <input
                type="number"
                name="closed"
                placeholder="e.g. 6"
                value={form.closed}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Flow Sent</label>
              <input
                type="number"
                name="flowSent"
                placeholder="e.g. 4"
                value={form.flowSent}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldWrapStyle}>
              <label style={labelStyle}>Acquisitions</label>
              <input
                type="number"
                name="acquisition"
                placeholder="e.g. 3"
                value={form.acquisition}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <h2 style={sectionTitleStyle}>Notes</h2>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Session Notes</label>
            <textarea
              name="notes"
              placeholder="Area notes, objections, wins, lessons..."
              value={form.notes}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>

          <div style={{ marginTop: "28px" }}>
            <button type="submit" style={buttonStyle}>
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLog;