"use client";

import Map, {
	NavigationControl,
	GeolocateControl,
	MapRef,
	useMap,
	Layer,
	Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import classes from "./Page.module.css";
import React, {
	ReactElement,
	ReactNode,
	ReactPortal,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Idata } from "@/app/map/page";
import { request } from "graphql-request";
import { QueryCountries } from "@/lib/client";
import { type, features } from "@/asset/custom.geo.json";
import mapboxgl, { CircleLayer } from "mapbox-gl";
import { log } from "console";
import * as turf from '@turf/turf';

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

interface Props {
	children?: Idata;
}

export default function Home({ children }: Props) {

	const mapContainer: any = useRef(null);
	const map: any = useRef(null);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			accessToken: mapboxToken,
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [100.523186, 13.736717],
			zoom: 10
		});
	},[]);
	const [qldata, setQldata] = useState<any>();
	const [dataPolygon, setDataPolygon] = useState<any[]>([]);

	const [selectedId, setSelectedId] = useState<string>("AS");
	const [_selectedId, _setSelectedId] = useState<string>("Asia");

	let continents: any[];
	children?.continent
		? (continents = Object.entries(children?.continent))
		: (continents = []);
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

	const [viewState, setViewState] = React.useState({
		longitude: -100,
		latitude: 40,
		zoom: 3,
	});

	// let geojson: any = {
	// 	type: "Feature",
	// 	geometry: {

	// 	},
	// };

	let layerStyle: any = {
		'name': 'outline',
		'type': 'line',
		'layout': {},
		'paint': {
			'line-color': '#000',
			'line-width': 3
		},

	};

	let layerStyle2: any = {
		'type': 'fill',
		'source': 'maine',
		'layout': {},
		'paint': {
			'fill-color': '#0080ff',
			'fill-opacity': 0.5
		}
	};

	const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedId(event.target.value);
		_setSelectedId(event.target.name);
	};

	const fetcher = async (query: string) => {
		const res: Data = await request(
			"https://countries.trevorblades.com/",
			query
		);
		return res;
	};

	useEffect(() => {
		// console.log(selectedId, _selectedId);
		let countrys: any[] = features.filter(
			(e) => e.properties.continent == _selectedId
		);

		let q = QueryCountries(selectedId);
		fetcher(q)
			.then((data) => {
				let tmp_: any = [];
				countrys.map(country => {
					let [f] = data.continent.countries.filter(em => em.code == country.properties.iso_a2);
					country.properties.emoji = f;
					tmp_.push(country);
					// let bbox = turf.bbox(country.geometry.coordinates);
					if (country.geometry.type == "Polygon") {
						let line = turf.lineString(country.geometry.coordinates[0]);
						let bbox = turf.bbox(line);
						let bboxPolygon = turf.bboxPolygon(bbox);
						console.log(bboxPolygon);
					}

				});
				setDataPolygon(tmp_);
				// console.log(tmp_);

			})
			.catch((e) => {
				console.log(e);
			});
		// console.log(qldata);

		// setData(countrys);
	}, [selectedId]);

	return (
		<main className={classes.mainStyle}>
			<div className="w-full mb:max-w-full mb:flex absolute opacity-85 left-10 top-10 z-10 max-w-sm p- bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-300 dark:border-gray-200">
				<div className="mb:h-auto mb:w-24 rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
					<div className="text-gray-900 font-bold text-xl mb-2">Tool Bar</div>
				</div>
				<ul className="border-r rounded-t border-b border-l border-gray-300 lg:border-l-0 lg:border-t lg:border-gray-400 bg-gray-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
					{continents.map((c) => (
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

			<div>
				<div ref={mapContainer} className="map-container" />

			</div>

			{/* <Map
				ref={mapContainer}
				className="map-container" 
				{...viewState}
				onMove={(evt) => setViewState(evt.viewState)}
				mapboxAccessToken={mapboxToken}
				mapStyle="mapbox://styles/mapbox/dark-v11"
				style={{ height: "100%", width: "100%" }}
				initialViewState={{
					latitude: 13.736717,
					longitude: 100.523186,
					zoom: 10,
				}}
				maxZoom={20}
				minZoom={3}
			>
				{
					dataPolygon.map((polygon, i) =>
						<Source id={`my-data-${polygon.properties.iso_a2}`} key={polygon.properties.iso_a2} type="geojson" data={polygon}>
							<Layer {...layerStyle2} />
						</Source>
					)
				}

			</Map> */}
		</main>
	);
}
