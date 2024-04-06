import React, { useState } from "react";
import SearchBar from "./SmallComponents/SearchBar";
import Empty from "./SmallComponents/Empty";
import LoadingBar from "react-top-loading-bar";
import Channels from "./SmallComponents/Channels";
import ResultLength from "./SmallComponents/ResultLength";
import MaxResultsFilter from "./SmallComponents/Filters/MaxResultsFilter";
import ErrorMessage from "./SmallComponents/ErrorMessage";
import CountryFilter from "./SmallComponents/Filters/CountryFilter";

function Homepage() {
  //! states
  const [youtubeData, setYoutubeData] = useState([]);
  const [totalResults,setTotalResults] = useState(0)
  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxResults, setMaxResults] = useState(10);
  const [ErrorLoader, setErrorLoader] = useState(false);

  const videoInfo = async (query) => {
    setLoader(true);
    try {
      const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=video&key=${
        import.meta.env.VITE_API_KEY
      }`;
      setProgress(25);
      const data = await fetch(URL);
      if (data.status != 200) {
        setErrorLoader(true);
        setProgress(100);
        return;
      }
      const obj = await data.json();
      setProgress(50);
      const { items, pageInfo:{totalResults} } = obj;
      setProgress(90);
      setYoutubeData(items);
      setTotalResults(totalResults)
      setProgress(100);
    } catch (err) {
      alert(err);
      setProgress(100);
    }
  };
  //! Getting data from search bar
  const getData = (value) => {
    videoInfo(value);
  };
  let channelId = youtubeData.map((item) => {
    return item.snippet.channelId;
  });
  return (
    <div>
      {loader ? (
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      ) : null}
      <div className="error-loader position-relative">
        {ErrorLoader ? (
          <ErrorMessage
            title={"Api Error"}
            message={"There is an error with the API"}
            buttonMessage={"Exit"}
            setErrorLoader={setErrorLoader}
          />
        ) : null}
      </div>
      <div className="container mt-3">
        <SearchBar getData={getData} componentError={ErrorLoader}/>
      </div>
      <div className="container d-flex justify-content-center mb-3 gap-2">
        <MaxResultsFilter maxResults={maxResults} setMaxResults={setMaxResults} />
        <CountryFilter/>
      </div>
      {channelId != 0 ? (
        <div>
          <ResultLength result={channelId.length} totalResults={totalResults}/>
          <div className="container-fluid flex-wrap d-flex justify-content-center gap-3 pb-4">
            {channelId.map((item, index) => {
              return (
                <div key={index}>
                  <Channels videoId={item} index={index}/>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Empty data={"Search To See Channel stats"} />
      )}
    </div>
  );
}

export default Homepage;
