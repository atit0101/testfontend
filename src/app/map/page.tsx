"use client";
import Map from '@/components/Map';
import { client, QueryCountries } from '@/lib/client';
import { continents, countries, languages, getEmojiFlag, ICountry, TContinents } from 'countries-list';
import mapboxgl, { MapboxEvent } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'urql';
import classes from "./Page.module.css";
import request from 'graphql-request';
import { features } from "@/asset/custom.geo.json";
import { log } from 'console';
import * as turf from '@turf/turf';

export type Idata = {
	continent?: TContinents;
};

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VubnkyMDc0NyIsImEiOiJjbDc4dWVmNHMwZGRoM3duZ3BzcWcycmI0In0.t0jdD7V9WJrxDz0ha-79Pg';

interface Country {
	name: string;
	code: string;
	emoji: string;
	emojiU: string;
}

interface Continent {
	code: string;
	name: string;
	countries: Country[];
}

interface Data {
	continent: Continent;
}

export default function Home() {
	const mapContainer: HTMLElement | string | any = useRef<HTMLElement | string | any>(null);
	const map: mapboxgl.Map | any = useRef<mapboxgl.Map | null>(null);
	const [lng, setLng] = useState(-70.9);
	const [lat, setLat] = useState(42.35);
	const [zoom, setZoom] = useState(9);
	const [selectedId, setSelectedId] = useState<string>("AS");
	const [_selectedId, _setSelectedId] = useState<string>("Asia");
	const [qldata, setQLdata] = useState<any>();
	const [datasource, setDatasource] = useState<any>();
	const [idsource, setIdsource] = useState<string>("my-map-AS");
	let list_continent: [string, string][] = Object.entries(continents);



	const fetcher = async (query: string) => {
		const res: Data = await request(
			"https://countries.trevorblades.com/",
			query
		);
		setQLdata(res);
		return res;
	};

	const removeAllSourcesAndLayers = () => {
		if (map.current) {
			const mapInstance = map.current;

			// First, remove all layers
			const layers = mapInstance.getStyle().layers;
			if (layers) {
				layers.forEach((layer: any) => {
					if (mapInstance.getLayer(layer.id) && mapInstance.getLayer(layer.id).id.match("my-layer") != null) {
						mapInstance.removeLayer(layer.id);
					}
				});
			}

			// Then, remove all sources
			const sources = mapInstance.getStyle().sources;
			Object.keys(sources).forEach((sourceId) => {
				if (mapInstance.getSource(sourceId) && sourceId.match("my-map") != null) {
					mapInstance.removeSource(sourceId);
				}
			});
		}
	};



	useEffect(() => {
		if (map.current) return;

		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/dark-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.current.on('move', () => {
			setLng(map?.current?.getCenter().lng.toFixed(4));
			setLat(map?.current?.getCenter().lat.toFixed(4));
			setZoom(map?.current?.getZoom().toFixed(2));
		});

		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});
	
		
	});

	useEffect(() => {
		let q = QueryCountries(selectedId);
		fetcher(q);

	}, [selectedId]);

	useEffect(() => {
		if (!qldata) return;
		// console.log(qldata);
		let countrys: any[] = features.filter((e) => e.properties.continent == _selectedId);

		let tmp: any[] = [];
		countrys.map(e => {
			let [f] = qldata.continent.countries.filter((em: any) => em.code == e.properties.iso_a2);
			e.properties.emoji = f;
			if (e.geometry.type == "Polygon") {
				let line = turf.lineString(e.geometry.coordinates[0]);
				tmp.push(line.geometry.coordinates);

			} else {
				e.geometry.coordinates.forEach((e: any) => {
					e.forEach((a: any) => {
						tmp.push(a);
					});
				});

			}
		});
		// console.log(tmp);
		let line = turf.lineString(tmp.flat(1));
		let bbox = turf.bbox(line);
		map.current.fitBounds(bbox);

		// let data: any[] = [];
		// tmp.forEach((e: any) => {
		// 	data.push(e.geometry.coordinates);
		// 	map.current.addSource("my-map-" + e.properties.iso_a2 , {
		// 		"type": "geojson",
		// 		"data": e
		// 	});

		// 	map.current.addLayer({
		// 		'id': "my-map-" + e.properties.iso_a2,
		// 		'type': 'fill',
		// 		'source': "my-map-" + e.properties.iso_a2,
		// 		'layout': {},
		// 		'paint': {
		// 			'fill-color': '#0080ff',
		// 			'fill-opacity': 0.5
		// 		}
		// 	});
		// });




		setDatasource(tmp);

	}, [qldata]);


	useEffect(() => {
		if (!datasource || datasource?.properties?.region_un == _selectedId) return;

		// console.log(datasource);
		// datasource;

		// map.current.addSource("my-map", {
		// 	"type": "geojson",
		// 	"data": {
		// 		'type': 'Feature',
		// 		'geometry': {
		// 			'type': 'Polygon',
		// 			'coordinates': [
		// 				datasource
		// 			]
		// 		}
		// 	}
		// 	});



		datasource.forEach((e: any, i: number) => {
			map.current.addSource("my-map" + i, {
				"type": "geojson",
				"data": {
					'type': 'Feature',
					'geometry': {
						'type': 'Polygon',
						'coordinates': [e]
					}
				}
			});

			map.current.addLayer({
				'id': "my-layer" + i,
				'type': 'fill',
				'source': "my-map" + i,
				'layout': {},
				'paint': {
					'fill-color': '#0080ff',
					'fill-opacity': 0.5
				}
			});


		});
		// datasource.forEach((e: any, i:number) => {map.current.removeSource("my-map" + i)});	  

		// console.log(map.current.getStyle().layers);



		// if (sourceObject || idsource != id) {
		// 	map.current.removeSource(idsource);
		// 	console.log(idsource);

		// } else {
		// 	console.log(id);


		// 	setIdsource(id)

		// }


		// });





	}, [datasource]);


	const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		removeAllSourcesAndLayers();

		setSelectedId(event.target.value);
		_setSelectedId(event.target.name);
	};

	return (

		<div className={classes.fullScreen}>
			{/* <div className="sidebar">
			</div> */}

			<div className="w-full mb:max-w-full mb:flex absolute opacity-85 left-10 top-10 z-10 max-w-sm p- bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-300 dark:border-gray-200">
				<div className="mb:h-auto mb:w-24 rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
					<div className="text-gray-900 font-bold text-xl mb-2">Tool Bar</div>
				</div>
				<div>
					<div className="text-gray-900 font-bold text-sm mb-2">
						Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
					</div>
				</div>
				<ul className="border-r rounded-t border-b border-l border-gray-300 lg:border-l-0 lg:border-t lg:border-gray-400 bg-gray-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
					{list_continent.map((c) => (
						<li className="flex items-center justify-start mx-10" key={c[0]}>
							<div>
								{
									<input
										type="radio"
										value={c[0]}
										name={c[1]}
										checked={selectedId == c[0]}
										onChange={handleSelection}
										id={c[0]}
										className="accent-green-600"
									/>
								}
							</div>
							<label
								htmlFor="default-radio-2"
								className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-950"
							>
								{c[1]}
							</label>
						</li>
					))}
				</ul>
				{/* <div>
					{
						dataPolygon.map((e, i) =>

							<div key={i}>{i} {e.properties.admin}  {e.properties?.emoji?.emoji}</div>
						)
					}
				</div> */}
			</div>

			<div ref={mapContainer} className={classes.mapContainer} />
		</div>
		// <div>
		// 	{/* <Map>{_data}</Map> */}

		// // </div>
		// <div className='mainStyle'>

		// 	<div ref={mapContainer} className="map-container" />
		// </div>
	);
}
