require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");

const { processLeads } = require("./services/leadProcessor");

const app = express();
const leadsPath = path.join(__dirname, "data/leads.json");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OfficeKit AI Running");
});

app.post("/test-lead", (req, res) => {
  const leads = JSON.parse(fs.readFileSync(leadsPath, "utf8"));
  const id = `LEAD${String(leads.length + 1).padStart(3, "0")}`;

  const lead = {
    leadId: id,
    name: req.body.name || "Test User",
    phone: req.body.phone || "+919000000001",
    source: req.body.source || "test",
    flag: false,
    status: "new"
  };

  leads.push(lead);
  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));

  res.json({ success: true, lead });
});

app.post("/webhook/call-result", (req, res) => {
  console.log(req.body);

  res.json({
    success: true
  });
});

cron.schedule("* * * * *", async () => {
  console.log("Checking Leads");

  await processLeads();
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
