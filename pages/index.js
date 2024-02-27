import { useState, useRef } from 'react'
import Image from 'next/image'
import buildspaceLogo from '../assets/buildspace-logo.png'
import { countryList } from '../assets/countryList'
import {
   IconCircleNumber1,
   IconCircleNumber2,
   IconCircleNumber3,
   IconCircleNumber4,
   IconCircleNumber5
} from '@tabler/icons'

const popularCountries = ['Japan', 'Italy', 'France', 'Spain', 'Thailand']
const months = ['Any month', 'January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const basePrompt = "Write me an itinerary giving for"
const addHotelsPrompt = "- Hotel (prefer not to change it unless traveling to another city)\n"
const addRestaurantsPrompt = "- 2 Restaurants, one for lunch and another for dinner, with shortened Google Map links\n"

const Home = () => {
   const [duration, setDuration] = useState(7)
   const [hotels, setHotels] = useState(true)
   const [restaurants, setRestaurants] = useState(true)
   const [flights, setFlights] = useState(true)
   const [train, setTrain] = useState(false)
   const [bus, setBus] = useState(false)
   const [selectedCountry, setSelectedCountry] = useState('')
   const [selectedMonth, setSelectedMonth] = useState('Any month')
   const [sourceCountry, setSourceCountry] = useState('')

   const [apiOutput, setApiOutput] = useState('')
   const [isGenerating, setIsGenerating] = useState(false)

   const divRef = useRef(null); 
  
  const scrollToDiv = () => { 
    window.scrollTo({ 
      top: divRef.current.offsetTop, 
      behavior: 'smooth' 
    }); 
  }; 

   const callGenerateEndpoint = async () => {
      setIsGenerating(true)

      let prompt = `${basePrompt} ${duration} days to ${selectedCountry} in the coming ${selectedMonth}.Describe the weather that month, and also 5 things to take note about this country's culture.\nFor each day, list me the following:\n- Attractions suitable for that season\n- Estimated cost of transportation of modes like ${flights ? 'flights' : ''}  ${train ? 'and trains' : ''}  ${bus ? 'and buses' : ''} from  ${sourceCountry} to ${selectedCountry} show the price in the currency of that city or country, mention prices as start from.\n- Estimated cost of hotels and accommodations\n- Estimated cost of meals and dining experiences`
      if (hotels) prompt += addHotelsPrompt
      if (restaurants) prompt += addRestaurantsPrompt
      prompt += 'and give me a daily summary of the above points into a paragraph or two.\n'

      console.log('Calling OpenAI with prompt...')
      // console.log(prompt)

      const response = await fetch('/api/generate', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      const { output } = data
      console.log('OpenAI replied...', output)

      setApiOutput(`${output}`)
      setIsGenerating(false)
      scrollToDiv()
   }

   return (
      <div className="root">
         <div className="flex max-[600px]:flex-col w-full">
            <div className="container-left">
               <div className="header">
                  <div className="header-title">
                     <h1>Travel Itinerary Generator</h1>
                  </div>
                  <div className="header-subtitle">
                     <h2>
                       Generate your custom itinerary for your travel plans without any hassle.
                     </h2>
                  </div>
               </div>
               <div className="prompt-container">
                  <div className="flex items-center">
                     <IconCircleNumber1 color="rgb(110 231 183)" />
                     <span className="ml-2">Enter Source and Desination City/Country.</span>
                  </div>
                  {/* <input
                  type="text"
                  placeholder="A country you are interested in visiting"
                  className="prompt-box"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
               /> */}
                  <div>
                     <form className='flex gap-4'>
                        <div>
                          
                           <input id='source' type='text' name='source' placeholder='Source' onChange={(e) => { setSourceCountry(e.target.value) }} className=' bg-transparent rounded-3xl border-1 border-[#818181]' required />
                        </div>
                        <div>
                           
                           <input id='desitnation' type='text' name='desitnation' placeholder='Desitnation' onChange={(e) => { setSelectedCountry(e.target.value) }} className=' bg-transparent rounded-3xl border-1 border-[#818181]' required />
                        </div>
                     </form>
                  </div>
                  <div className="areas-of-interests">
                     <div
                        style={{
                           color: '#fff',
                           display: 'inline-block',
                           marginRight: '.8rem',
                        }}
                     >
                     {popularCountries.map((i) => (
                        <button
                           className={`item ${selectedCountry.includes(i) && 'selected'}`}
                           key={i}
                           onClick={() => {
                              setSelectedCountry(i)
                           }}
                        >
                           {i}
                        </button>
                     ))}
                     </div>
                  </div>
                  <div className="mt-4">
                     <div>
                        <div className="flex items-center mb-2">
                           <IconCircleNumber2 color="rgb(110 231 183)" />
                           <span className="ml-2">Mode of Travel?</span>
                        </div>
                        <div>
                           <label className="inline-flex items-center mr-8">
                              <input
                                 type="checkbox"
                                 className="rounded checked:bg-blue-500"
                                 value={flights}
                                 checked={flights}
                                 onChange={(e) =>
                                  setFlights(e.target.checked)
                               }
                              />
                              <span className="ml-2">Flights</span>
                           </label>

                           <label className="inline-flex items-center mr-8">
                              <input
                                 type="checkbox"
                                 className="rounded checked:bg-blue-500"
                                 value={train}
                                 onChange={(e) => setTrain(e.target.checked)}
                                 checked={train}
                              />
                              <span className="ml-2">Trains</span>
                           </label>

                           <label className="inline-flex items-center">
                              <input
                                 type="checkbox"
                                 className="rounded checked:bg-blue-500"
                                 value={bus}
                                 onChange={(e) => setBus(e.target.checked)}
                                 checked={bus}
                              />
                              <span className="ml-2">Buses</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="flex w-100 mt-4">
                     <div
                        className="flex-none mr-6 flex-col items-start"
                        style={{ display: 'flex', width: '180px' }}
                     >
                        <div className="flex items-center mb-2">
                           <IconCircleNumber3 color="rgb(110 231 183)" />
                           <span className="ml-2">How many days?</span>
                        </div>
                        <input
                           type="number"
                           className="rounded block"
                           value={duration}
                           onChange={(e) => setDuration(e.target.value)}
                           style={{ width: '180px' }}
                        />
                     </div>
                     <div className="ml-4">
                     <div className="flex items-center mb-2">
                           <IconCircleNumber4 color="rgb(110 231 183)" />
                           <span className="ml-2">Month</span>
                        </div>
                     <select
                     value={selectedMonth}
                     onChange={(e) => setSelectedMonth(e.target.value)}
                     className="prompt-box"
                  >
                     <option value="">Select a month</option>
                     {months.map((m) => (
                        <option key={m} value={m}>
                           {m}
                        </option>
                     ))}
                  </select>
                  </div>
                  </div>
                  <div className="mt-4">
                     <div>
                        <div className="flex items-center mb-2">
                           <IconCircleNumber5 color="rgb(110 231 183)" />
                           <span className="ml-2">Recommendations?</span>
                        </div>
                        <div>
                           <label className="inline-flex items-center mr-8">
                              <input
                                 type="checkbox"
                                 className="rounded checked:bg-blue-500"
                                 value={restaurants}
                                 checked={restaurants}
                                 onChange={(e) =>
                                  setRestaurants(e.target.checked)
                               }
                              />
                              <span className="ml-2">🍔 Restaurants</span>
                           </label>

                           <label className="inline-flex items-center">
                              <input
                                 type="checkbox"
                                 className="rounded checked:bg-blue-500"
                                 value={hotels}
                                 onChange={(e) => setHotels(e.target.checked)}
                                 checked={hotels}
                              />
                              <span className="ml-2">🏨 Hotels</span>
                           </label>
                        </div>
                     </div>
                  </div>
                  <div className="prompt-buttons">
                     <button
                        className="pushable py-2 px-4 rounded"
                        onClick={callGenerateEndpoint}
                        disabled={isGenerating}
                     >
                        <span className="shadow"></span>
                        <span className="edge"></span>
                        <div className="front">
                           {isGenerating ? (
                              <div>
                                <span className="loader mr-2"></span>
                                <span>Applying magic now...</span>
                              </div>
                           ) : (
                              <span className="font-semibold">Generate</span>
                           )}
                        </div>
                     </button>
                  </div>
               </div>
            </div>
            <div className="container-right" ref={divRef}>
               {apiOutput && (
                  <div className="output">
                     <div className="output-header-container">
                        <div className="output-header">
                           <h3>Your Itinerary</h3>
                        </div>
                     </div>
                     <div className="output-content">
                        <p>{apiOutput}</p>
                     </div>
                  </div>
               )}
            </div>
         </div>
   )
}

export default Home
