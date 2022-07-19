const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export function initMap() {
	mapboxgl.accessToken = MAPBOX_TOKEN;
	return new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		center: [-60.476513, -31.749138],
		zoom: 12,
	});
}
