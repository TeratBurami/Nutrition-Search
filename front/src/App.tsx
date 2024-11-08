import { useState } from "react";
import "./App.css";

export default function App(this: any) {
  const [search_data,SetsearchData]=useState([])
  const [search,SetSearch]=useState('')

  const Searching = async () => {
    SetsearchData([])
    console.log(search)
    if(search){
      fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: {search} }),
      })
        .then((response) => response.json())
        .then((data) => {
          SetsearchData(data.data)
        });
    }
    else{
      SetsearchData([])
    }
  };

  return (
    <div>
      <h1 className="text-center">Nutrition Search</h1>
      <h3 className="text-center">By Elastic Search</h3>
      <div className="container">
        <input
          id="search"
          type="text"
          placeholder="Search for a food nutrition"
          onChange={(e) => SetSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && Searching()}        />
        <button onClick={Searching}>Search</button>
        <div className="result-container">
          <h3>Result ({search_data.length})</h3>
          <div className="line"></div>
          {search_data.map((item)=>(
            <div key={item}>
              <h5 className="search-result">{item}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
