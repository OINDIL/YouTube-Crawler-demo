import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'
import { useAllContext } from '../Context/AllContextAPI'
import { IoSearch } from "react-icons/io5";


function SearchBar({ getData, componentError }) {
    const {input, setInput} = useAllContext()
    const [ErrorLoader, setErrorLoader] = useState(false)
    const handleInput = (event) => {
        setInput(event.target.value)
    }
    const handleClick = () => {
        if (input === '') {
            setErrorLoader(true)
            return
        }
        getData(input)
    }
    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            if (input === '') {
                setErrorLoader(true)
                return
            }
            getData(input)
        }
    }
    return (
        <div>
            <div className="error-loader position-relative">
                {ErrorLoader ? <ErrorMessage title={'Empty Input Field'} message={'Enter Some Keywords to Search'} buttonMessage={'Search Again'} setErrorLoader={setErrorLoader} /> : null}
            </div>
            <div className="container input-group mb-4" style={{ maxWidth: '500px', marginTop: '4rem' }}>
                <input type="text" className="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2"
                    onChange={handleInput}
                    onKeyDown={handleEnterKey}
                    disabled={ErrorLoader || componentError}
                    defaultValue={input}
                />
                <button className="btn btn-danger" type="button" id="button-addon2" onClick={handleClick} disabled={ErrorLoader || componentError}><IoSearch/></button>
            </div>

        </div>
    )
}

export default SearchBar