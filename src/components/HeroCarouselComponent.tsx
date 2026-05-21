"use client";

import React from "react";
import { HeroCarousel } from "@/interfaces/interfaces";
import { CldImage } from "next-cloudinary";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

interface HeroCarouselComponentProps {
  item: HeroCarousel;
  setItems: React.Dispatch<React.SetStateAction<HeroCarousel[]>>;
  onEdit: (item: HeroCarousel) => void;
}

const HeroCarouselComponent = ({
  item,
  setItems,
  onEdit,
}: HeroCarouselComponentProps) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/hero-carousel?id=${item._id}`);
        setItems((prev) => prev.filter((i) => i._id !== item._id));
        Swal.fire("Deleted!", "Item has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete item.", "error");
      }
    }
  };

  const toggleStatus = async () => {
    try {
      const res = await axios.put(`/api/hero-carousel?id=${item._id}`, {
        isActive: !item.isActive,
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? res.data.data : i))
      );
    } catch (error) {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  return (
    <div className="w-[97%] bg-white dark:bg-boxdark shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-4 gap-4">
      <div className="flex gap-2">
        <div className="text-center">
          <p className="text-xs mb-1">Desktop</p>
          <CldImage
            width="120"
            height="60"
            src={item.desktopImage}
            alt="Desktop"
            className="rounded object-cover h-[60px] w-[120px]"
          />
        </div>
        <div className="text-center">
          <p className="text-xs mb-1">Mobile</p>
          <CldImage
            width="60"
            height="80"
            src={item.mobileImage}
            alt="Mobile"
            className="rounded object-cover h-[80px] w-[60px]"
          />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.path}</p>
        <div className="flex gap-4 mt-2 text-xs">
          <span>Order: {item.order}</span>
          <span className={item.isActive ? "text-green-500" : "text-red-500"}>
            {item.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleStatus}
          className={`px-3 py-1 rounded text-xs text-white ${
            item.isActive ? "bg-yellow-500" : "bg-green-500"
          }`}
        >
          {item.isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
        >
          <MdEdit size={24} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <MdDelete size={24} />
        </button>
      </div>
    </div>
  );
};

export default HeroCarouselComponent;
