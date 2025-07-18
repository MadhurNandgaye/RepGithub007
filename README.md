
Here are the commands to set up this project:

* `npx create-react-app my-api-dashboard`
* `cd my-api-dashboard`
* `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material recharts`
* `npm install @mui/x-date-pickers dayjs`
* `npm start`




### **Presentation Title Suggestion:**
"Proactive API Health: A Dashboard for Performance Monitoring & Self-Healing"

---

### **Understanding How This Project Monitors APIs (and how it would in a real-world scenario):**

At its heart, monitoring an API means continuously checking its availability and performance. This project simulates that process.

#### **1. The Core Monitoring Loop (Simulated)**

* **In this Project (Simulation):**
    * We use a **`setInterval`** function (set to 15 seconds) inside React's **`useEffect`** hook. This function acts like a scheduled task in a real Logic App, triggering a "check" on all defined APIs.
    * The **`simulateApiCall`** helper function then generates **dummy latency values** for each API. It randomly decides if an API is "healthy," "degraded," or "critical" by comparing this simulated latency against a predefined `baselineLatency`.
    * Crucially, it simulates checks from **two perspectives**: `internalLatency` (as if from your private network) and `externalLatency` (as if from the public internet). This is key for diagnosing where an issue might lie.
    * Every 15 seconds, the dashboard's data updates, showing new latencies, health statuses, and a "Last Checked" timestamp.

* **In a Real-World Logic App:**
    * Instead of `setInterval` and `simulateApiCall`, a real Logic App would integrate with **monitoring agents or probes**.
    * These agents/probes would send **actual HTTP requests (e.g., GET/POST with sample payloads)** to your API endpoints.
    * They would collect **real performance metrics**:
        * **Response Time (Latency):** How long it takes to get a response.
        * **HTTP Status Codes:** Whether the API returned 200 OK, 404 Not Found, 500 Internal Server Error, etc.
        * **Payload Size:** If the response payload is unusually large or small.
        * **Content Validation:** Ensuring the response body contains expected data.
    * These checks would genuinely originate from both **internal network locations** (e.g., servers in your datacenter) and **external public internet locations** (e.g., global monitoring nodes).

---

### **How This Project Addresses Your Requirements (For Presentation):**

This dashboard visually represents the outcomes of these monitoring efforts, directly tackling the objectives you outlined:

#### **a. Assess Individual Endpoint Health Status (Red/Yellow/Green) from internal network and external public internet**

* **Visual Representation:** The table clearly shows each API endpoint with its `Internal Health` and `External Health` displayed as **colored chips (Green/Yellow/Red)**.
    * **Green (Healthy):** API is performing within expected `baselineLatency`.
    * **Yellow (Degraded):** Performance is slower than baseline but not critical (e.g., 100-200% of baseline).
    * **Red (Critical):** Performance is severely impacted (e.g., >200% of baseline) or a simulated error occurred.
* **Latency & Baseline Comparison:** The table explicitly lists `Internal Latency (ms)`, `External Latency (ms)`, and `Baseline (ms)`. This allows for direct comparison.
* **Trend Indicators:** Small arrow icons beside the latencies (up, down, or flat) visually indicate if performance is `improving`, `degrading`, or `stable` compared to the previous check.
* **Diagnostic Power:** By showing both internal and external health, the dashboard allows you to quickly pinpoint the problem's scope:
    * **Both Red/Yellow:** Issue is likely with the API itself or its internal dependencies.
    * **Internal Green, External Red/Yellow:** Issue is likely with public network routing, CDN, or geographical factors impacting external users.

#### **b. Provide Summary Status and Alerts via email, RSS feed or some subscription-based notification mechanism**

* **Overall System Status:** The dedicated "Overall System Status" card at the top provides a high-level summary:
    * **Operational:** All APIs are healthy.
    * **Degraded:** Some APIs are in a Yellow state.
    * **Critical:** One or more APIs are in a Red state.
    * This gives an immediate "health snapshot" for management.
* **Alerting (Conceptual):**
    * The "Notification & Alerting" section *explains* how a real Logic App would integrate with various notification channels:
        * **Email:** For detailed alerts to specific teams.
        * **RSS Feed:** For broader, subscribable updates.
        * **Subscription-based Notifications:** Integration with tools like Slack, Microsoft Teams, PagerDuty, or Opsgenie to push real-time alerts to on-call engineers or relevant communication channels.
    * In a real system, these notifications would trigger automatically when an API's status changes to Yellow or Red, or when performance deviates significantly from the baseline.

#### **c. Automate some action as a self-heal resolution under certain condition (e.g., auto-restart app service or IIS app pool related to the given application)**

* **Self-Healing (Conceptual):**
    * The "Automated Self-Healing Actions" section outlines powerful capabilities of a Logic App. While this front-end project doesn't *execute* these actions, it clearly describes the potential for automated remediation.
    * **Conditions:** Explain that self-healing would be triggered based on predefined conditions (e.g., an API remaining in a 'Red' state for a specific duration, or consistent critical errors).
    * **Examples of Actions:**
        * **Auto-Restart Application Service:** For application-level issues (memory leaks, unhandled exceptions).
        * **IIS App Pool Recycle:** For web applications facing unresponsiveness or resource issues.
        * **Failover to Secondary Instance:** In high-availability setups, rerouting traffic to a healthy backup.
* **Benefits:** Emphasize that these automated actions significantly reduce downtime, improve system resilience, and free up operations teams from manual intervention for common issues. They are a core part of "self-healing" infrastructure.

---

### **Conclusion for Presentation:**

"This dashboard, while a simulation, effectively demonstrates how a modern Logic App can provide **real-time visibility** into API performance from multiple vantage points, offer **immediate alerting** through various channels, and enable **proactive, automated self-healing actions**. This capability is crucial for maintaining high availability, ensuring optimal user experience, and building resilient, self-managing applications in today's dynamic IT environments."
