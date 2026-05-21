import mongoose from "mongoose";

const HeroCarouselSchema = new mongoose.Schema(
  {
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Shop Now",
    },
    desktopPosition: {
      top: { type: String, default: "50%" },
      left: { type: String, default: "50%" },
    },
    mobilePosition: {
      top: { type: String, default: "50%" },
      left: { type: String, default: "50%" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const HeroCarouselModel =
  mongoose.models.HeroCarousel ||
  mongoose.model("HeroCarousel", HeroCarouselSchema);

export default HeroCarouselModel;
