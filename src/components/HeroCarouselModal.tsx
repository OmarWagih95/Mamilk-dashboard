"use client";

import React, { useState, useEffect } from "react";
import { HeroCarousel } from "@/interfaces/interfaces";
import axios from "axios";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import Swal from "sweetalert2";

interface HeroCarouselModalProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  setItems: React.Dispatch<React.SetStateAction<HeroCarousel[]>>;
  editItem?: HeroCarousel | null;
}

const HeroCarouselModal = ({
  isModalOpen,
  setModalOpen,
  setItems,
  editItem,
}: HeroCarouselModalProps) => {
  const [formData, setFormData] = useState<Partial<HeroCarousel>>({
    title: "Shop Now",
    path: "/",
    desktopImage: "",
    mobileImage: "",
    desktopPosition: { top: "50%", left: "50%" },
    mobilePosition: { top: "50%", left: "50%" },
    isActive: true,
    order: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData({
        title: "Shop Now",
        path: "/",
        desktopImage: "",
        mobileImage: "",
        desktopPosition: { top: "50%", left: "50%" },
        mobilePosition: { top: "50%", left: "50%" },
        isActive: true,
        order: 0,
      });
    }
  }, [editItem, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.desktopImage || !formData.mobileImage) {
      Swal.fire("Error", "Please upload both desktop and mobile images", "error");
      return;
    }

    setLoading(true);
    try {
      if (editItem) {
        const res = await axios.put(`/api/hero-carousel?id=${editItem._id}`, formData);
        setItems((prev) =>
          prev.map((item) => (item._id === editItem._id ? res.data.data : item))
        );
        Swal.fire("Success", "Hero section updated successfully", "success");
      } else {
        const res = await axios.post("/api/hero-carousel", formData);
        setItems((prev) => [res.data.data, ...prev]);
        Swal.fire("Success", "Hero section created successfully", "success");
      }
      setModalOpen(false);
    } catch (error: any) {
      Swal.fire("Error", error.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-boxdark w-full max-w-2xl rounded-lg shadow-lg p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {editItem ? "Edit Hero Section" : "Add New Hero Section"}
          </h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded dark:bg-form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Path (Link)</label>
              <input
                type="text"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                className="w-full p-2 border rounded dark:bg-form-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Desktop Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {formData.desktopImage ? (
                  <div className="relative group">
                    <CldImage
                      width="300"
                      height="150"
                      src={formData.desktopImage}
                      alt="Desktop Preview"
                      className="rounded mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, desktopImage: "" }))}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                    onSuccess={(result: any) => {
                      setFormData((prev) => ({ ...prev, desktopImage: result.info.public_id }));
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                      >
                        Upload Desktop Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs">Top %</label>
                  <input
                    type="text"
                    value={formData.desktopPosition?.top}
                    onChange={(e) => setFormData({
                      ...formData,
                      desktopPosition: { ...formData.desktopPosition!, top: e.target.value }
                    })}
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs">Left %</label>
                  <input
                    type="text"
                    value={formData.desktopPosition?.left}
                    onChange={(e) => setFormData({
                      ...formData,
                      desktopPosition: { ...formData.desktopPosition!, left: e.target.value }
                    })}
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Mobile Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {formData.mobileImage ? (
                  <div className="relative group">
                    <CldImage
                      width="150"
                      height="200"
                      src={formData.mobileImage}
                      alt="Mobile Preview"
                      className="rounded mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, mobileImage: "" }))}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                    onSuccess={(result: any) => {
                      setFormData((prev) => ({ ...prev, mobileImage: result.info.public_id }));
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                      >
                        Upload Mobile Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs">Top %</label>
                  <input
                    type="text"
                    value={formData.mobilePosition?.top}
                    onChange={(e) => setFormData({
                      ...formData,
                      mobilePosition: { ...formData.mobilePosition!, top: e.target.value }
                    })}
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs">Left %</label>
                  <input
                    type="text"
                    value={formData.mobilePosition?.left}
                    onChange={(e) => setFormData({
                      ...formData,
                      mobilePosition: { ...formData.mobilePosition!, left: e.target.value }
                    })}
                    className="w-full p-1 text-sm border rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full p-2 border rounded dark:bg-form-input"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : editItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroCarouselModal;
