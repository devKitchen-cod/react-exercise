import React from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import useSWR from 'swr'
import './App.css';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const DEFAULT_FIRST_COLOR = 'white';
const DEFAULT_SECOND_COLOR = 'black';

// -- define fetcher method that will be used by SWR nad set baseURL from constant --
const fetcher = url => axios.get(url, {
  baseURL: BASE_API_URL,
}).then(res => res.data);


// -- method for parsing color names from string --
const parseColors = (colorsString) => {
  const [firstColor, secondColor] = colorsString.split(" ");
  return {
    firstColor: firstColor.toLowerCase(),
    secondColor:secondColor.toLowerCase()
  };
}

// -- map with all available house colors --
const HOUSE_COLORS_MAP = {
  scarlet: '#FF2400',
  gold: '#FFD700',
  yellow: 'yellow',
  black: 'black',
  green: 'green',
  silver: '#C0C0C0',
};


// -- house component that renders house item --
const House = ({ house }) => {
  const { firstColor, secondColor } = parseColors(house?.houseColours);
  return <div className="houses__item">
    <div className="houses__item-header">
      <h2 style={{}}>{house?.name}</h2>
      <p className="houses__item-animal-name">
        {house?.animal}
      </p>
    </div>
    <div
      className='houses__item-gradient'
      style={{
        background: `linear-gradient(0.25turn,
          ${HOUSE_COLORS_MAP[firstColor] || DEFAULT_FIRST_COLOR},
          ${HOUSE_COLORS_MAP[secondColor] || DEFAULT_SECOND_COLOR})`,
      }}
    />
    <div className="houses__item-footer">
      <p className="houses__item-footer-founder-label">Founder: </p>
      <p className="houses__item-footer-founder-value">{house?.founder}</p>
    </div>
  </div>
}

// -- main root component --
const App = () => {
  // -- fetch data via SWR --
  const { data, error, isLoading } = useSWR('/houses', fetcher);

  if (error) return <div>Error: failed to load data from API</div>

  if (isLoading) return <ClipLoader color="#36d7b7" size={150} />

  return (
    <div className="houses__list-wrapper">
      <h1>Houses</h1>
      <div className="houses__container">
        {data.map((house, index) => (
          <House key={`house-${index}`} house={house} />
        ))}
      </div>
    </div>
  );
};

export default App;
