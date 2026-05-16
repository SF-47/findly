import axios from "axios";

const axiosClient = axios.create({
    baseURL :"http://localhost:5192",
});

export default axiosClient; 