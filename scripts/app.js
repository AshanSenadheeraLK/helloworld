document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    const countriesContainer = document.getElementById('countries');
    const searchInput = document.getElementById('searchInput');
    let countriesData = [];
    let filteredCountries = [];

    const fetchCountries = async () => {
        try {
            countriesContainer.innerHTML = createSkeletonCards(6); // Show skeletons while loading
            const response = await axios.get(apiUrl);
            countriesData = response.data;
            filteredCountries = countriesData;
            renderCountries(filteredCountries);
        } catch (error) {
            countriesContainer.innerHTML = `<p class="text-center text-red-500">Error loading countries data</p>`;
        }
    };

    const createSkeletonCards = (count) => {
        return Array.from({ length: count }).map(() => `
            <div class="skeleton p-4 rounded-lg shadow-lg"></div>
        `).join('');
    };

    const renderCountries = (countries) => {
        countriesContainer.innerHTML = countries.map(country => `
            <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img src="${country.flags.png}" alt="${country.name.common}" class="h-40 w-full object-cover rounded-lg mb-4">
                <h2 class="text-2xl font-bold text-blue-600">${country.name.common}</h2>
                <p><strong>Official Name:</strong> ${country.name.official}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Country Code:</strong> ${country.cca2}</p>
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                <p><strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A'}</p>
                <a href="https://maps.google.com/?q=${country.name.common}" target="_blank" class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">View on Google Maps</a>
            </div>
        `).join('');
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        filteredCountries = countriesData.filter(country => country.name.common.toLowerCase().includes(query));
        renderCountries(filteredCountries);
    });

    fetchCountries();
});
