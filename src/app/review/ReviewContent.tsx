"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReviewDetails, useReviewStore } from "@/store/useReviewStore";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { showAlert } from "@/utils/alertStore";

export default function ReviewContent() {
  const router = useRouter();
  const { addReview, verifyReview, verifyResponse, alreadyExistErrMsg } = useReviewStore();
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get("token");
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState<string>('');
  const [isReviewExist, isSetReviewExist] = useState<boolean>(false);

  useEffect(() => {
    if (token && token !== null) {
      verifyReview(token);
    }
  }, [token]);

  useEffect(() => {
    if (alreadyExistErrMsg) {
      isSetReviewExist(true);
    }
  }, [alreadyExistErrMsg]);
  const handleSubmit = () => {
    if (rating === 0) return showAlert.warning("Please select a rating ⭐");
    if (verifyResponse?.bookingId && verifyResponse?.userId && rating && token) {
      const formData: ReviewDetails = {
        token: token,
        bookingId: verifyResponse?.bookingId,
        userId: verifyResponse?.userId,
        rating,
        comment: feedbackContext,
      }
      addReview(formData)

    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">

      {!isReviewExist ? <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6"
      >
        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800">
              ⭐ Rate Your Stay
            </h1>

            <p className="text-center text-gray-500 mt-2">
              Your feedback makes us better 😊
            </p>

            {/* STAR RATING */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  className={`text-4xl ${rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </motion.button>
              ))}
            </div>

            {/* REVIEW TEXT */}
            <textarea
              placeholder="Share your experience..."
              className="w-full mt-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              onChange={(e) => setFeedbackContext(e.target.value)}
            />

            {/* SUBMIT */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold"
            >
              Submit Review
            </motion.button>
          </>
        ) : (
          /* THANK YOU STATE */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Thank You!
            </h2>
            <p className="text-gray-500 mt-2">
              Your review has been submitted successfully.
            </p>

            {/* Home Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")} // Navigate to home
              className="mt-6 px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-md hover:bg-green-600 transition"
            >
              Go to Home
            </motion.button>
          </motion.div>

        )}
      </motion.div> :


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </motion.div>

          {/* Title */}
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Review Submitted
          </h2>

          {/* Description */}
          <p className="mt-2 text-gray-600 leading-relaxed">
            You have already shared your feedback for this booking.
            <br />
            Thank you for your time! 🙏
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl bg-green-500 py-3 text-white font-medium shadow-md hover:bg-green-600 transition"
            >
              Go to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-xl border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      }
    </div>
  );
}
