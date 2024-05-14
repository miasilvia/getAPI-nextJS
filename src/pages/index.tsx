import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";
//untuk menentukan tipe data
interface Article {
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  urlToImage: string;
}

interface NewsData {
  articles: Article[];
}

const NewsComponent = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // tambahkan state untuk halaman saat ini
  const PER_PAGE = 6; // jumlah item per halaman

  //mengambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://newsapi.org/v2/everything?q=bitcoin&apiKey=a5e8ae536d7b4dffaa66470eedeae8fc";
      try {
        const response = await axios.get(url);
        setNewsData(response.data);
      } catch (error) {
        console.error(`Error fetching news: ${error}`);
      }
    };

    fetchData();
  }, []);

  //filter data
  const filteredData =
    newsData?.articles.filter((item) => {
      const date = new Date(item.publishedAt);
      const itemDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
      return (
        (searchTitle === "" ||
          item.author?.toLowerCase().includes(searchTitle.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTitle.toLowerCase())) &&
        (searchDate === "" || itemDate === searchDate)
      );
    }) || [];

  // data untuk halaman saat ini
  const currentData = filteredData.slice(
    currentPage * PER_PAGE,
    (currentPage + 1) * PER_PAGE
  );

  if (!newsData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center mt-10">
        <input
          type="text"
          placeholder="Filter by Keyword..."
          onChange={(e) => setSearchTitle(e.target.value)}
          className="mb-4 border-2 border-black p-1"
        />
        <input
          type="date"
          placeholder="Cari berdasarkan tanggal publikasi..."
          onChange={(e) => setSearchDate(e.target.value)}
          className="mb-4 border-2 border-black p-1"
        />
        <div className="flex  flex-wrap justify-center   ">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="bg-pink-500 hover:bg-pink-700 text-white  py-2 px-4 p-5 m-5  basis-1/5 rounded-xl"
            >
              <div className="w-80 h-200 flex justify-center">
                <img src={item.urlToImage} alt="" className="rounded-md h-60" />
              </div>
              <h2 className="font-bold mt-5 mb-5">Title: {item.title}</h2>
              <p>Description: {item.description}</p>
              <p>
                Publish date:{" "}
                {new Date(item.publishedAt).toISOString().split("T")[0]}
              </p>
              <p>Author : {item.author}</p>
            </div>
          ))}
        </div>

        {/* Tombol navigasi */}
        <div className="flex justify-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * PER_PAGE >= filteredData.length}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsComponent;
