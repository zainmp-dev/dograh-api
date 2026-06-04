const fs = require("fs");
const path = require("path");
const { triggerDograhCall } = require("./dograhService");

const leadsPath = path.join(__dirname, "../data/leads.json");
const resultsPath = path.join(__dirname, "../data/call-results.json");

async function processLeads() {
  const leads = JSON.parse(fs.readFileSync(leadsPath, "utf8"));

  const pending = leads.filter((x) => x.flag === false);

  for (const lead of pending) {
    console.log("Calling:", lead.phone);

    const result = await triggerDograhCall(lead);

    if (result) {
      lead.flag = true;
      lead.status = "called";

      const existingResults = JSON.parse(
        fs.readFileSync(resultsPath, "utf8")
      );

      existingResults.push({
        leadId: lead.leadId,
        phone: lead.phone,
        callDate: new Date(),
        result
      });

      fs.writeFileSync(
        resultsPath,
        JSON.stringify(existingResults, null, 2)
      );
    }
  }

  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
}

module.exports = {
  processLeads
};
