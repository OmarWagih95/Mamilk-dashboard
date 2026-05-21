"use client";

import React, { useState, useEffect, useCallback } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeroCarouselModal from "@/components/HeroCarouselModal";
import HeroCarouselComponent from "@/components/HeroCarouselComponent";
import { HeroCarousel } from "@/interfaces/interfaces";
import axios from "axios";

const HeroSectionPage = () => {
  const [items, setItems] = useState<HeroCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<HeroCarousel | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/hero-carousel");
      setItems(res.data.data);
    } catch (error) {
      console.error("Error fetching hero items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item: HeroCarousel) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  return (
    <DefaultLayout>
      <div className="px-1 md:px-4 py-4 w-full min-h-screen flex flex-col gap-6 bg-backgroundColor">
        <div className="w-[97%] flex justify-between items-center bg-white dark:bg-boxdark p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Hero Section Management
          </h1>
          <button
            onClick={handleAddNew}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all font-semibold"
          >
            ADD NEW HERO
          </button>
        </div>

        <HeroCarouselModal
          isModalOpen={isModalOpen}
          setModalOpen={setIsModalOpen}
          setItems={setItems}
          editItem={editItem}
        />

        <div className="flex flex-col gap-4 items-center">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <HeroCarouselComponent
                key={item._id}
                item={item}
                setItems={setItems}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-boxdark w-[97%] rounded-lg">
              <p className="text-gray-500">No hero sections found. Add your first one!</p>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HeroSectionPage;
