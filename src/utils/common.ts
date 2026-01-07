import { Reviews } from "@/store/useReviewStore";
import { percent } from "framer-motion";

export const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const calculateStats = (reviews: Reviews[]) => {
    const total = reviews.length;
    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length
        return {
            star, count, percent: total > 0 ? (count / total) * 100 : 0
        }
    });

    const avgRating = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : "0.0";
    return { avgRating, total, distribution };
}

export const calculateStatsByRoom = (reviews: Reviews[] , id : string | number) => {
    const filterByRoomId = reviews.filter(item => item.bookingId?.room?._id === id);

    const total = filterByRoomId.length;
    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = filterByRoomId.filter(r => r.rating === star).length
        return {
            star, count, percent: total > 0 ? (count / total) * 100 : 0
        }
    });

    const avgRating = total > 0 ? (filterByRoomId.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : "0.0";
    return { avgRating, total, distribution };
}
