"use client";

import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import classes from "./Page.module.css";
import React, { ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Idata } from "@/app/map/page";

import { gql, useQuery } from "@apollo/client";

const USER_QUERY = gql`
  query Query {
	continent(code: "AS") {
	  code
	  countries {
		name,
		code,
		emoji,
		emojiU
	  }
	  name
	}
  }
`;


interface Props {
	children?: Idata;
}

const GetData = async () => {
	const { data, loading } = await useQuery(USER_QUERY);
	console.log(data);
	
} 

export default function Home({ children }: Props) {
	let continents: any[];
	children?.continent ? continents = Object.entries(children?.continent) : continents = [];

	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
	const [viewState, setViewState] = React.useState({
		longitude: -100,
		latitude: 40,
		zoom: 3.5,
	});

	

	const [selectedId, setSelectedId] = useState<string>('AS');
	
	useEffect(() => {
		
		console.log(selectedId);
		GetData()
		// const { data, loading } = useQuery(USER_QUERY);
		// if (loading) {
		// 	return <div>loading.....</div>;
		// }
	}, [selectedId]);
	
	const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedId(event.target.value);
	};


	return (
		<main className={classes.mainStyle}>
			<div className="w-full mb:max-w-full mb:flex absolute opacity-85 left-10 top-10 z-10 max-w-sm p- bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-300 dark:border-gray-200">
				<div className="mb:h-auto mb:w-24 rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
					<div className="text-gray-900 font-bold text-xl mb-2">
						Tool Bar
					</div>
				</div>
				<ul className="border-r rounded-t border-b border-l border-gray-300 lg:border-l-0 lg:border-t lg:border-gray-400 bg-gray-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
					{

						continents.map((c) =>
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
											className="accent-green-600" />
									}
								</div>
								<label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-950">
									{c[1]}
								</label>

							</li>)
					}
				</ul>
			</div>
			<Map
				mapboxAccessToken={mapboxToken}
				mapStyle="mapbox://styles/mapbox/streets-v12"
				style={{ height: "100%", width: "100%" }}
				initialViewState={{
					latitude: 13.736717,
					longitude: 100.523186,
					zoom: 10,
				}}
				maxZoom={20}
				minZoom={3}
			></Map>
		</main>
	);
}
