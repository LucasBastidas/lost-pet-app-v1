const MAPBOX_TOKEN =
	"pk.eyJ1IjoibHVjYXNiYXN0aWRhcyIsImEiOiJjbDRyN2dvMzUweWxlM2tyMWY4NjNlbnZ6In0.e_5VH7dMQXwivRwgdGAN9w";
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
