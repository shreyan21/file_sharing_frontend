import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/usercontext.js";

const FilePage = () => {
  const [file, setFile] = useState([]);
  const { usertoken } = useContext(UserContext);

  // Memoize the getdetails function to avoid redefining it on every render
  const getdetails = useCallback(async () => {
    try {
      const result = await fetch('http://localhost:3200/file/showfiles', {
        method: 'GET',
        headers: { 'Authorization': usertoken }
      });
      const data = await result.json();

      // Ensure that the response contains the 'files' array
      if (data && data.files) {
        setFile(data.files);  // Update state with the fetched files
      } else {
        console.error('No files found in the response:', data);
      }
    } catch (e) {
      console.error('Error fetching files:', e);
    }
  }, [usertoken]);  // usertoken as dependency for getdetails

  // Fetch files when component mounts
  useEffect(() => {
    getdetails();
  }, [getdetails]);  // Only re-run when getdetails changes

  // Log the files after they are fetched
  
  return (
    <div className="container my-5">
    <div className="row">
      {/* Check if files are loaded */}
      {file.length === 0 ? (
        <p className="mt-5">Loading or no files available...</p>  // Display loading message if no files
      ) : (
        file.map((e, i) => (
          <div className="col-md-4 " key={i}>
            <div className="card shadow-sm h-100">
             
              {e.icon}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{e.name}</h5>
                <p className="card-text">
                  <strong>Size:</strong> {e.size} KB <br />
                  <strong>Last Modified:</strong> {(e.modifiedDate)} <br />
                  <strong>Type:</strong> {e.type}
                </p>
                <a href="#" className="btn btn-primary mt-auto">View File</a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  );
}

export default FilePage;
