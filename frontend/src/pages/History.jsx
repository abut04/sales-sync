import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";

function History() {
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
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

  const fetchLogs = async () => {
    try {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "performance_logs"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data()
      }));

      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this log?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "performance_logs", id));
      fetchLogs();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (log) => {
    setEditingId(log.id);
    setEditForm({
      date: log.date || "",
      hoursWorked: log.hoursWorked || "",
      doorsKnocked: log.doorsKnocked || "",
      spokenTo: log.spokenTo || "",
      presented: log.presented || "",
      closed: log.closed || "",
      flowSent: log.flowSent || "",
      acquisition: log.acquisition || "",
      notes: log.notes || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (id) => {
    try {
      await updateDoc(doc(db, "performance_logs", id), {
        date: editForm.date,
        hoursWorked: Number(editForm.hoursWorked),
        doorsKnocked: Number(editForm.doorsKnocked),
        spokenTo: Number(editForm.spokenTo),
        presented: Number(editForm.presented),
        closed: Number(editForm.closed),
        flowSent: Number(editForm.flowSent),
        acquisition: Number(editForm.acquisition),
        notes: editForm.notes
      });

      setEditingId(null);
      fetchLogs();
    } catch (error) {
      alert(error.message);
    }
  };

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px",
    fontFamily: "Arial"
  };

  const containerStyle = {
    maxWidth: "1100px",
    margin: "0 auto"
  };

  const headerCard = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "25px"
  };

  const logCard = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    marginBottom: "16px"
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginTop: "15px"
  };

  const metricBox = {
    backgroundColor: "#f1f5f9",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center"
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    width: "100%"
  };

  const buttonRow = {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap"
  };

  const editButton = {
    padding: "10px 14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  };

  const deleteButton = {
    padding: "10px 14px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  };

  const saveButton = {
    padding: "10px 14px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  };

  const cancelButton = {
    padding: "10px 14px",
    backgroundColor: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerCard}>
          <h1 style={{ marginBottom: "10px" }}>Performance History</h1>
          <p style={{ color: "#475569" }}>
            Review, edit, and manage your past sessions.
          </p>
        </div>

        {sortedLogs.length === 0 ? (
          <div style={headerCard}>
            <p>No logs yet.</p>
          </div>
        ) : (
          sortedLogs.map((log) => (
            <div key={log.id} style={logCard}>
              {editingId === log.id ? (
                <>
                  <div style={grid}>
                    <input type="date" name="date" value={editForm.date} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="hoursWorked" placeholder="Hours Worked" value={editForm.hoursWorked} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="doorsKnocked" placeholder="Doors Knocked" value={editForm.doorsKnocked} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="spokenTo" placeholder="People Spoken To" value={editForm.spokenTo} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="presented" placeholder="Presented" value={editForm.presented} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="closed" placeholder="Closed" value={editForm.closed} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="flowSent" placeholder="Flow Sent" value={editForm.flowSent} onChange={handleEditChange} style={inputStyle} />
                    <input type="number" name="acquisition" placeholder="Acquisitions" value={editForm.acquisition} onChange={handleEditChange} style={inputStyle} />
                  </div>

                  <div style={{ marginTop: "15px" }}>
                    <textarea
                      name="notes"
                      value={editForm.notes}
                      onChange={handleEditChange}
                      placeholder="Notes"
                      rows="4"
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  <div style={buttonRow}>
                    <button style={saveButton} onClick={() => handleUpdate(log.id)}>
                      Save Changes
                    </button>
                    <button style={cancelButton} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ marginBottom: "5px" }}>{log.date}</h3>
                  <p style={{ color: "#64748b", marginBottom: "10px" }}>
                    {log.hoursWorked} hours worked
                  </p>

                  <div style={grid}>
                    <div style={metricBox}>
                      <strong>Doors</strong>
                      <p>{log.doorsKnocked}</p>
                    </div>
                    <div style={metricBox}>
                      <strong>Spoken</strong>
                      <p>{log.spokenTo}</p>
                    </div>
                    <div style={metricBox}>
                      <strong>Presented</strong>
                      <p>{log.presented}</p>
                    </div>
                    <div style={metricBox}>
                      <strong>Closed</strong>
                      <p>{log.closed}</p>
                    </div>
                    <div style={metricBox}>
                      <strong>Flow</strong>
                      <p>{log.flowSent}</p>
                    </div>
                    <div style={metricBox}>
                      <strong>Acq</strong>
                      <p>{log.acquisition}</p>
                    </div>
                  </div>

                  {log.notes && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "12px",
                        backgroundColor: "#eff6ff",
                        borderRadius: "8px"
                      }}
                    >
                      <strong>Notes:</strong>
                      <p style={{ marginTop: "5px" }}>{log.notes}</p>
                    </div>
                  )}

                  <div style={buttonRow}>
                    <button style={editButton} onClick={() => handleEditClick(log)}>
                      Edit
                    </button>
                    <button style={deleteButton} onClick={() => handleDelete(log.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;