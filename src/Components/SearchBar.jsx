export default function SearchBar({ input, hints, onInputChange, onHintClick }) {

    let listItems = hints?.map((item) => {
      return <li key={item.id} ><button className='hint' onClick={() => onHintClick(item.id)}>{item.name + " - " + item.region + ", " + item.country}</button></li>
    });
  
    listItems = (listItems && listItems?.length < 1) ? (<li key={-1}><button className='hint'>No matches found</button></li>) : listItems;
  
    if (input === "") {
      listItems = <></>;
    }
  
    return (<div className='searchBar'>
      <input className='inputField' value={input} onChange={(e) => onInputChange(e.target.value)} ></input>
      <div className='list-container' >
        <ul className="hintList">
          {listItems}
        </ul>
      </div>
    </div>);
  }