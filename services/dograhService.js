const axios = require("axios");

async function triggerDograhCall(lead) {
  try {
    const response = await axios.post(
      process.env.DOGRAH_API_URL,
      {
        leadId: lead.leadId,
        name: lead.name,
        phone: lead.phone
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DOGRAH_API_KEY}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

module.exports = {
  triggerDograhCall
};
