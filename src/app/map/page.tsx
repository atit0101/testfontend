import Map from '@/components/Map'
import { continents, countries, languages , getEmojiFlag,ICountry, TContinents } from 'countries-list'

export type Idata = {
	continent ? : TContinents
}

export default function Home() {

	
	const _data : Idata = {
		continent: continents 
	}

  return (
      <div>
		{/* <img src={`https://flagcdn.com/24x18/th.png`} alt='flag' /> */}
      	<Map>{_data}</Map>
      </div>
	);
}
