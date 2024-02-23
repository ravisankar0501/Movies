// Function to fetch data from your Flask API
function fetchData() {
    axios.get('/api/movies')  // Replace with your actual API endpoint URL
         .then(response => {
             // Handle the API response here
             console.log(response.data);
         })
         .catch(error => {
             // Handle errors
             console.error(error);
         });
}
