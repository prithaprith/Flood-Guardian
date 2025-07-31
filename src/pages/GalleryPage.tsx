import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Define types
type ImageData = {
  filename: string;
  state: string;
  lga: string;
  ward: string;
  date: string;
  time: string;
};

// Sample image data with valid Nigerian states, LGAs, and wards
const imageData: ImageData[] = [
  {
    filename: "img1.jpg",
    state: "Lagos",
    lga: "Ikeja",
    ward: "Alausa",
    date: "2025-07-30",
    time: "14:35",
  },
  {
    filename: "img2.jpeg",
    state: "Lagos",
    lga: "Ikeja",
    ward: "Alausa",
    date: "2025-07-30",
    time: "14:50",
  },
  {
    filename: "img3.jpeg",
    state: "Kano",
    lga: "Nasarawa",
    ward: "Bakin Ruwa",
    date: "2025-07-29",
    time: "09:10",
  },
  {
    filename: "img4.jpeg",
    state: "Kano",
    lga: "Nasarawa",
    ward: "Bakin Ruwa",
    date: "2025-07-29",
    time: "09:25",
  },
  {
    filename: "img5.jpeg",
    state: "FCT Abuja",
    lga: "Municipal",
    ward: "Garki",
    date: "2025-07-28",
    time: "16:40",
  },
  {
    filename: "img6.jpeg",
    state: "FCT Abuja",
    lga: "Municipal",
    ward: "Garki",
    date: "2025-07-28",
    time: "16:55",
  },
  {
    filename: "img7.jpeg",
    state: "Lagos",
    lga: "Ikeja",
    ward: "Alausa",
    date: "2025-07-27",
    time: "11:00",
  },
  {
    filename: "img11.jpeg",
    state: "Kaduna",
    lga: "Chikun",
    ward: "Sabon Tasha",
    date: "2025-07-26",
    time: "18:20",
  },
  {
    filename: "img12.jpeg",
    state: "Kaduna",
    lga: "Chikun",
    ward: "Sabon Tasha",
    date: "2025-07-26",
    time: "18:35",
  },
  {
    filename: "img13.jpeg",
    state: "Benue",
    lga: "Gboko",
    ward: "Yandev",
    date: "2025-07-25",
    time: "10:15",
  },
  {
    filename: "img14.jpeg",
    state: "Benue",
    lga: "Gboko",
    ward: "Yandev",
    date: "2025-07-25",
    time: "10:30",
  },
  {
    filename: "img15.jpeg",
    state: "Lagos",
    lga: "Ikeja",
    ward: "Alausa",
    date: "2025-07-24",
    time: "15:45",
  },
  {
    filename: "img16.jpeg",
    state: "Kano",
    lga: "Nasarawa",
    ward: "Bakin Ruwa",
    date: "2025-07-23",
    time: "13:20",
  },
];

const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("All");
  const [selectedLGA, setSelectedLGA] = useState("All");
  const [selectedWard, setSelectedWard] = useState("All");

  const states = [
    "All",
    ...Array.from(new Set(imageData.map((img) => img.state))),
  ];
  const lgas = [
    "All",
    ...Array.from(
      new Set(
        imageData
          .filter(
            (img) => selectedState === "All" || img.state === selectedState
          )
          .map((img) => img.lga)
      )
    ),
  ];
  const wards = [
    "All",
    ...Array.from(
      new Set(
        imageData
          .filter(
            (img) =>
              (selectedState === "All" || img.state === selectedState) &&
              (selectedLGA === "All" || img.lga === selectedLGA)
          )
          .map((img) => img.ward)
      )
    ),
  ];

  const filteredImages = imageData.filter((img) => {
    const matchState = selectedState === "All" || img.state === selectedState;
    const matchLGA = selectedLGA === "All" || img.lga === selectedLGA;
    const matchWard = selectedWard === "All" || img.ward === selectedWard;
    return matchState && matchLGA && matchWard;
  });

  return (
    <div className="p-4 pb-24 min-h-screen bg-background">
      <h2 className="text-2xl font-bold mb-4 text-center">Flood Gallery</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="state-select"
            className="mb-1 font-semibold text-gray-700"
          >
            Filter by State
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLGA("All");
              setSelectedWard("All");
            }}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {states.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="lga-select"
            className="mb-1 font-semibold text-gray-700"
          >
            Filter by LGA
          </label>
          <select
            id="lga-select"
            value={selectedLGA}
            onChange={(e) => {
              setSelectedLGA(e.target.value);
              setSelectedWard("All");
            }}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={selectedState === "All"}
          >
            {lgas.map((lga, i) => (
              <option key={i} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="ward-select"
            className="mb-1 font-semibold text-gray-700"
          >
            Filter by Ward
          </label>
          <select
            id="ward-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={selectedLGA === "All"}
          >
            {wards.map((ward, i) => (
              <option key={i} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map((img, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={`/flood-gallery/${img.filename}`}
              alt={`Flood ${index + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="p-2 text-sm text-center bg-muted">
              {img.state} - {img.lga} - {img.ward} <br />
              <span className="text-xs text-gray-600">
                {img.date} at {img.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    </div>
  );
};

export default GalleryPage;
