document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    const countriesContainer = document.getElementById('countries');
    const searchInput = document.getElementById('searchInput');
    let countriesData = [];
    let filteredCountries = [];

    const fetchCountries = async () => {
        try {
            countriesContainer.innerHTML = createSkeletonCards(10);
            const response = await axios.get(apiUrl);
            countriesData = response.data;
            filteredCountries = countriesData;
            console.log('Fetched countries data:', countriesData);
            renderCountries(filteredCountries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };
    

    const createSkeletonCards = (count) => {
        return Array.from({ length: count }).map(() => `
            <div class="skeleton p-4 rounded-lg shadow-lg">
                <div class="h-40 mb-4"></div>
                <div class="h-6 mb-2"></div>
                <div class="h-4"></div>
            </div>
        `).join('');
    };

    const renderCountries = (countries) => {
        countriesContainer.innerHTML = countries.map(country => `
            <div class="bg-white p-4 rounded-lg shadow-lg animate-bottom-to-top">
                <img src="${country.flags.png}" alt="${country.name.common}" class="h-40 w-full object-cover rounded-lg mb-4">
                <h2 class="text-2xl font-bold">${country.name.common}</h2>
                <p><strong>Official Name:</strong> ${country.name.official}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Country Code:</strong> ${country.cca2}</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                <p><strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A'}</p>
                <p><strong>Live Time:</strong> <span id="time-${country.cca2}"></span></p>
                <p><strong>Live Date:</strong> <span id="date-${country.cca2}"></span></p>
                <a href="https://maps.google.com/?q=${country.name.common}" target="_blank" class="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded">View on Google Maps</a>
            </div>
        `).join('');
        updateTimes();
    };

    const updateTimes = () => {
        filteredCountries.forEach(country => {
            const timeElement = document.getElementById(`time-${country.cca2}`);
            const dateElement = document.getElementById(`date-${country.cca2}`);
            if (timeElement && dateElement) {
                setInterval(() => {
                    const now = moment().utcOffset(country.timezones[0]);
                    timeElement.textContent = now.format('HH:mm:ss');
                    dateElement.textContent = now.format('YYYY-MM-DD');
                }, 1000);
            }
        });
    };

    searchInput.addEventListener('input', _.debounce(() => {
        const query = searchInput.value.toLowerCase();
        filteredCountries = countriesData.filter(country => country.name.common.toLowerCase().includes(query));
        renderCountries(filteredCountries);
    }, 300));

    fetchCountries();
});
