import axios from 'axios';

async function fetchJsFile(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default fetchJsFile;
