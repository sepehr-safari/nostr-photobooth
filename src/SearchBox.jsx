import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import axios from 'axios'

import Search from './assets/search.jsx'

const SearchBox = ({ addPerson }) => {
  const [modal, setModal] = useState(false);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const handleFocus = (event) => {
    search(event.target.value);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setLoading(false);
  };

  const search = async (query) => {
    if (!query) return
    setModal(false);
    setLoading(true);
    let resp = await axios.get(
      `https://api.nostr.band/nostr?method=search&count=5&q=${query}`
    )
    let res = resp.data.people.slice(0, 3);
    setLoading(false);
    setModal(true);
    setPeople(res);
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setModal(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = debounce(async (event) => {
    search(event.target.value);
  }, 300);

  return (
    <>
      <form className="relative">   
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {loading ?     
              <svg className="w-6 h-6 text-neutral-600 animate-spin fill-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            : <Search className={`${isFocused ? 'text-primary' : 'text-neutral-600'}`} />}
          </div>
          <input
            type="text"
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="block w-full py-2 pr-3 pl-11 placeholder-neutral-600 text-white focus:border-2 border-primary outline-none rounded-lg bg-neutral-950"
            placeholder="Search profile, NIP-05 or npub1..."
            required/>
        </div>
        {modal && <div ref={searchRef} className="absolute w-full bg-surface-06dp border border-neutral-700 rounded-md shadow-md mt-4 py-1">
          {!people.length && <div className="text-sm text-white text-center py-4">
            No results found, try something else.
          </div>}
          {people.map((person, index) => 
            <div key={`person-${index}`} className="hover:bg-surface-24dp cursor-pointer flex justify-between items-center text-white" onClick={() => {addPerson(person); setModal(false);}}>
              <div className="flex items-center px-4 py-2">
                <img className="bg-white rounded-full h-8 w-8" src={person.picture}></img>
                <div className="ml-3 text-sm">     
                  <h3 className="font-bold">{person.name}</h3>
                  <p className="font-medium">{person.lud16}</p>
                </div>
              </div>
            </div>
          )}
        </div>}
      </form>
    </>
  );
};

export default SearchBox;
