export function getWeatherImagePath(pathSnippet) {
    const basePath = "../assets/images/weather/64x64/";
    const partialPath = pathSnippet.match(/((night|day)\/(\d)+.png)/i)[0];
    return basePath + partialPath;
}

export async function fetchSuggestions(input) {
    const key = "d26e8139afe0475ca10185046241001";
    const response = fetch(`https://api.weatherapi.com/v1/search.json?key=${key}&q=${input}`, {
        referrerPolicy: "strict-origin-when-cross-origin",
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    const places = response.then((result) => result.json())
        .catch((error) => console.log(error))
        .then(data => data.length > 0 ? data : []);

    return places;
}

export async function fetchForecast(placeId, lang = 'en', days = 3) {

    const key = "d26e8139afe0475ca10185046241001";
    const response = fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=id:${placeId}&lang=${lang}&days=${days}`, {
        referrerPolicy: "strict-origin-when-cross-origin",
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    const forecast = response.then((result) => result.json())
        .catch((error) => console.log(error))
        .then(data => data);

    return forecast;
}