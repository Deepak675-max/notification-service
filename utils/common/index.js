const axios = require("axios");


const makeAxiosGetRequest = async (service_end_point, headers) => {
    try {
        const config = {
            headers
        }
        const serviceReposne = await axios.get(service_end_point, config);
        if (serviceReposne.data.error) {
            throw error;
        }
        return serviceReposne.data.data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    makeAxiosGetRequest
}