import axios from "axios";
import { useEffect, useState } from "react";

function Banner() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await axios.get("http://localhost:3001/banner");
    console.log(data);
    setData(data.data.data);
  };

  console.log(data);

  return (
    <>
      {data?.map((item, index) => (
        <>
          <p>{item?.title}</p>
        </>
      ))}
    </>
  );
}
export default Banner;
