import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!auth.currentUser) return;

        const q = query(
          collection(db, "performance_logs"),
          where("userId", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const totalHours = logs.reduce((sum, log) => sum + (log.hoursWorked || 0), 0);
  const totalDoors = logs.reduce((sum, log) => sum + (log.doorsKnocked || 0), 0);
  const totalSpoken = logs.reduce((sum, log) => sum + (log.spokenTo || 0), 0);
  const totalPresented = logs.reduce((sum, log) => sum + (log.presented || 0), 0);
  const totalClosed = logs.reduce((sum, log) => sum + (log.closed || 0), 0);
  const totalFlow = logs.reduce((sum, log) => sum + (log.flowSent || 0), 0);
  const totalAcquisitions = logs.reduce((sum, log) => sum + (log.acquisition || 0), 0);

  const safePercent = (top, bottom) => {
    if (!bottom || bottom === 0) return "0%";
    return ((top / bottom) * 100).toFixed(1) + "%";
  };

  const safeDecimal = (top, bottom) => {
    if (!bottom || bottom === 0) return 0;
    return top / bottom;
  };

  const presentationRate = safePercent(totalPresented, totalSpoken);
  const closeRate = safePercent(totalClosed, totalPresented);
  const flowRate = safePercent(totalFlow, totalClosed);
  const acquisitionRate = safePercent(totalAcquisitions, totalFlow);
  const overallConversionRate = safePercent(totalAcquisitions, totalSpoken);

  const now = new Date();

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const start = new Date(d);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return end;
  };

  const sameWeek = (date) => {
    const d = new Date(date);
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);
    return d >= startOfWeek && d < endOfWeek;
  };

  const lastWeek = (date) => {
    const d = new Date(date);
    const startOfThisWeek = getStartOfWeek(now);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    return d >= startOfLastWeek && d < startOfThisWeek;
  };

  const sameMonth = (date) => {
    const d = new Date(date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const lastMonth = (date) => {
    const d = new Date(date);
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return d.getMonth() === previousMonth && d.getFullYear() === previousYear;
  };

  const sameQuarter = (date) => {
    const d = new Date(date);
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const logQuarter = Math.floor(d.getMonth() / 3);
    return d.getFullYear() === now.getFullYear() && currentQuarter === logQuarter;
  };

  const lastQuarter = (date) => {
    const d = new Date(date);
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const previousQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
    const previousQuarterYear = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const logQuarter = Math.floor(d.getMonth() / 3);
    return d.getFullYear() === previousQuarterYear && logQuarter === previousQuarter;
  };

  const weeklyLogs = logs.filter((log) => sameWeek(log.date));
  const previousWeeklyLogs = logs.filter((log) => lastWeek(log.date));

  const monthlyLogs = logs.filter((log) => sameMonth(log.date));
  const previousMonthlyLogs = logs.filter((log) => lastMonth(log.date));

  const quarterlyLogs = logs.filter((log) => sameQuarter(log.date));
  const previousQuarterlyLogs = logs.filter((log) => lastQuarter(log.date));

  const sumMetric = (arr, key) => arr.reduce((sum, item) => sum + (item[key] || 0), 0);

  const weeklyAcq = sumMetric(weeklyLogs, "acquisition");
  const previousWeeklyAcq = sumMetric(previousWeeklyLogs, "acquisition");

  const monthlyAcq = sumMetric(monthlyLogs, "acquisition");
  const previousMonthlyAcq = sumMetric(previousMonthlyLogs, "acquisition");

  const quarterlyAcq = sumMetric(quarterlyLogs, "acquisition");
  const previousQuarterlyAcq = sumMetric(previousQuarterlyLogs, "acquisition");

  const weeklyFlow = sumMetric(weeklyLogs, "flowSent");
  const monthlyFlow = sumMetric(monthlyLogs, "flowSent");
  const quarterlyFlow = sumMetric(quarterlyLogs, "flowSent");

  const weeklyClosed = sumMetric(weeklyLogs, "closed");
  const monthlyClosed = sumMetric(monthlyLogs, "closed");
  const quarterlyClosed = sumMetric(quarterlyLogs, "closed");

  const getComparisonText = (current, previous) => {
    if (previous === 0 && current === 0) return "No change";
    if (previous === 0 && current > 0) return "New growth";
    const diff = ((current - previous) / previous) * 100;
    if (diff === 0) return "No change";
    return `${diff > 0 ? "Up" : "Down"} ${Math.abs(diff).toFixed(1)}%`;
  };

  const weeklyComparison = getComparisonText(weeklyAcq, previousWeeklyAcq);
  const monthlyComparison = getComparisonText(monthlyAcq, previousMonthlyAcq);
  const quarterlyComparison = getComparisonText(quarterlyAcq, previousQuarterlyAcq);

  const closeToFlowRateValue = safeDecimal(totalFlow, totalClosed);
  const flowToAcqRateValue = safeDecimal(totalAcquisitions, totalFlow);
  const spokenToPresentedRateValue = safeDecimal(totalPresented, totalSpoken);

  const smartInsights = [];

  if (weeklyAcq > previousWeeklyAcq) {
    smartInsights.push("Your acquisitions improved compared to last week. Keep your current momentum going.");
  } else if (weeklyAcq < previousWeeklyAcq) {
    smartInsights.push("Your acquisitions are down compared to last week. Review what changed in your area, pitch, or consistency.");
  } else {
    smartInsights.push("Your weekly acquisition result is stable compared to last week. Focus on small improvements to break past your current level.");
  }

  if (monthlyAcq > previousMonthlyAcq) {
    smartInsights.push("This month is outperforming last month, which suggests stronger overall consistency across multiple sessions.");
  } else if (monthlyAcq < previousMonthlyAcq) {
    smartInsights.push("This month is trailing behind last month. It may be worth reviewing weaker sessions and spotting patterns in lower-performing days.");
  }

  if (quarterlyAcq > previousQuarterlyAcq) {
    smartInsights.push("This quarter is stronger than the previous one, showing a positive longer-term trend in your performance.");
  } else if (quarterlyAcq < previousQuarterlyAcq) {
    smartInsights.push("This quarter is below the previous quarter. Focus on improving your process at the biggest drop-off point in the funnel.");
  }

  if (spokenToPresentedRateValue < 0.35) {
    smartInsights.push("Your biggest drop-off may be before the presentation stage. Focus on stronger openings, curiosity, and smoother transitions.");
  }

  if (closeToFlowRateValue < 0.7) {
    smartInsights.push("You are reaching the close, but not enough of those closes are becoming flows. Work on tightening your call to action and urgency.");
  }

  if (flowToAcqRateValue < 0.7) {
    smartInsights.push("A noticeable number of flows are not turning into acquisitions. Focus on form completion, clarity, and reducing friction after the close.");
  }

  if (totalAcquisitions === 0 && totalFlow > 0) {
    smartInsights.push("You are generating activity, but acquisitions are not yet converting. This suggests the issue is likely after the flow stage rather than at the start of the funnel.");
  }

  if (logs.length < 5) {
    smartInsights.push("You still have a relatively small amount of data. As more logs are added, your dashboard insights and AI prediction will become more reliable.");
  }

  const chartData = {
    labels: ["Doors", "Spoken", "Presented", "Closed", "Flow", "Acquisitions"],
    datasets: [
      {
        label: "Performance Totals",
        data: [
          totalDoors,
          totalSpoken,
          totalPresented,
          totalClosed,
          totalFlow,
          totalAcquisitions
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(20, 184, 166, 0.7)"
        ],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Sales Performance Overview" }
    }
  };

  const lineData = {
    labels: sortedLogs.map((log) => log.date),
    datasets: [
      {
        label: "Acquisitions Over Time",
        data: sortedLogs.map((log) => log.acquisition || 0),
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Performance Trend (Acquisitions)" }
    }
  };

  const cardStyle = {
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    padding: "20px",
    minWidth: "220px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const sectionCard = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "30px"
  };

  const insightCardStyle = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px"
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        backgroundColor: "#fafafa",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>SalesSync Dashboard</h1>

      {logs.length === 0 ? (
        <p>No data available yet.</p>
      ) : (
        <>
          <h2>Totals</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "40px"
            }}
          >
            <div style={cardStyle}><strong>Total Hours Worked</strong><p>{totalHours}</p></div>
            <div style={cardStyle}><strong>Total Doors Knocked</strong><p>{totalDoors}</p></div>
            <div style={cardStyle}><strong>Total People Spoken To</strong><p>{totalSpoken}</p></div>
            <div style={cardStyle}><strong>Total Presented</strong><p>{totalPresented}</p></div>
            <div style={cardStyle}><strong>Total Closed</strong><p>{totalClosed}</p></div>
            <div style={cardStyle}><strong>Total Flow Sent</strong><p>{totalFlow}</p></div>
            <div style={cardStyle}><strong>Total Acquisitions</strong><p>{totalAcquisitions}</p></div>
          </div>

          <h2>Conversion Metrics</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "40px"
            }}
          >
            <div style={cardStyle}><strong>Presentation Rate</strong><p>{presentationRate}</p></div>
            <div style={cardStyle}><strong>Close Rate</strong><p>{closeRate}</p></div>
            <div style={cardStyle}><strong>Flow Rate</strong><p>{flowRate}</p></div>
            <div style={cardStyle}><strong>Acquisition Rate</strong><p>{acquisitionRate}</p></div>
            <div style={cardStyle}><strong>Overall Conversion Rate</strong><p>{overallConversionRate}</p></div>
          </div>

          <h2>Insights</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "40px"
            }}
          >
            <div style={cardStyle}>
              <strong>This Week</strong>
              <p>Acquisitions: {weeklyAcq}</p>
              <p>Flow Sent: {weeklyFlow}</p>
              <p>Closed: {weeklyClosed}</p>
              <p><strong>{weeklyComparison}</strong></p>
            </div>

            <div style={cardStyle}>
              <strong>This Month</strong>
              <p>Acquisitions: {monthlyAcq}</p>
              <p>Flow Sent: {monthlyFlow}</p>
              <p>Closed: {monthlyClosed}</p>
              <p><strong>{monthlyComparison}</strong></p>
            </div>

            <div style={cardStyle}>
              <strong>This Quarter</strong>
              <p>Acquisitions: {quarterlyAcq}</p>
              <p>Flow Sent: {quarterlyFlow}</p>
              <p>Closed: {quarterlyClosed}</p>
              <p><strong>{quarterlyComparison}</strong></p>
            </div>
          </div>

          <div style={sectionCard}>
            <h2>Smart Insights</h2>
            {smartInsights.map((insight, index) => (
              <div key={index} style={insightCardStyle}>
                <p style={{ margin: 0 }}>{insight}</p>
              </div>
            ))}
          </div>

          <div style={sectionCard}>
            <h2>Performance Chart</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div style={sectionCard}>
            <h2>Performance Over Time</h2>
            <Line data={lineData} options={lineOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;