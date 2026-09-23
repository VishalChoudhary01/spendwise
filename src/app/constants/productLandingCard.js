

export const product = {
    name: "AirPods Pro (2nd Gen)",
    detail: "Wireless Noise Cancelling",
    rating: "4.8",
    reviews: "12,400",
    image: "/images/webp/products/airpods.webp",
};

export const sources = [
    { id: "amazon", name: "Amazon", price: 22999 },
    { id: "flipkart", name: "Flipkart", price: 21499 },
    { id: "supported", name: "Supported source", price: 20999 },
];

const prices = sources.map((s) => s.price);

export const bestAvailablePrice = Math.min(...prices);
export const savings = Math.max(...prices) - bestAvailablePrice;

export const stages = [
    { id: "discover", label: "Discover" },
    { id: "compare", label: "Compare" },
    { id: "better-price", label: "Better available price" },
    { id: "pay-less", label: "Pay less" },
];
