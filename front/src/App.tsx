import { useState } from "react";
import "./App.css";

export default function App(this: any) {
  const [search_data,SetsearchData]=useState([])
  const [search,SetSearch]=useState('')
  
  const isVegan=()=>{
    if(search.includes('vegan') || search.includes('Vegan') || search.includes('VEGAN') || search.includes('vegetarian') || search.includes('Vegetarian') || search.includes('VEGETARIAN')){
      return "TRUE"
    }
    else{
      return "FALSE"
    }
  }

  const listData=(item:string, item2:string)=>{
    let nutrition=item.split(',')
    let amount=item2.split(',')
    let nutrition_data=[]
    for(let i=0; i<nutrition.length; i++){
      nutrition_data.push({
        name:nutrition[i],
        amount:amount[i]
      })
    }
    return nutrition_data
  }

  const Searching = async () => {
    SetsearchData([])
    if(search){
      fetch("http://localhost:3333/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: search, isVegan: isVegan() }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data)
          SetsearchData(data.data)
        });
    }
    else{
      SetsearchData([])
    }
  };

  return (
    <div className="mt-32">
      <h1 className="text-center text-6xl font-bold text-orange-600">Nutrition Search</h1>
      <h3 className="text-center text-xl font-semibold text-orange-400 mb-10">Using Elastic Search</h3>
      <div className="container mx-auto w-2/3">
        <div className="w-2/3 mx-auto">
          <input
            className="shadow shadow-slate-600 w-full h-14 px-3 rounded-xl border-2 border-orange-200 outline-none focus:border-orange-600 text-xl font-semibold text-orange-600"
            id="search"
            type="text"
            placeholder="Search for a food nutrition"
            onChange={(e) => SetSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && Searching()}/>
        <div className="w-1/4"><button onClick={Searching} className="bg-orange-500 py-2 px-4 rounded-xl text-white font-bold text-xl mt-3 w-full">Search</button></div>
        </div>
        <div className="mt-16 bg-white p-4 rounded-xl shadow shadow-slate-600">
          <h3 className="text-2xl font-bold text-orange-600">Result ({search_data.length})</h3>
          <div className="w-full h-0.5 bg-orange-700 my-6"></div>
          {search_data.map((item: any) => (
            <div key={item._id} className="flex gap-24 mx-16 mb-24 shadow shadow-slate-600 rounded-xl p-4">
              <div className="w-2/3">
                <h1 className="text-2xl font-bold text-orange-500 mb-4">{item._source.strFood} <span className="text-orange-700">({item._source.strCalories})</span></h1>
                <img className="rounded-xl w-full h-96 object-cover" src={item._source.image} alt="" />
                <h3 className="text-orange-600 text-lg font-semibold mt-1">{item._source.strDescription}</h3>
              </div>
              <div className="">
                <div className="mb-2">
                  <p className="text-2xl underline font-bold text-start text-orange-800 font-bold">Nutritions</p>
                  <ul className="list-disc">
                    {listData(item._source.strNutrition1,item._source.strAmount1).map((nutrition: any) => (
                      <li className="text-start text-orange-600 font-semibold"><span>{nutrition.name}</span> {nutrition.amount}</li>
                    ))}
                  </ul>
                </div>
                <div>
                <p className="text-2xl underline font-bold text-start text-orange-800 font-bold">Ingredients</p>
                  <ul className="list-disc">
                    {listData(item._source.strIngredient1,item._source.strMeasure1).map((nutrition: any) => (
                      <li className="text-start text-orange-600 font-semibold"><span>{nutrition.name}</span> {nutrition.amount}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
