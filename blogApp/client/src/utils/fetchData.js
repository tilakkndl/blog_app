async function fetchData(url, method="GET", body){
    const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
    }
    if (body) {
      options.body = JSON.stringify(body);
    }
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }

}

export default fetchData;
