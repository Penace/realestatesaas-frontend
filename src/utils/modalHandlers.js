import { useState } from "react";

export function useModalHandlers() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const openModal = (data) => {
    setReviewData(data);
    setShowReviewModal(true);
  };

  const closeModal = () => {
    setShowReviewModal(false);
    setReviewData(null);
  };

  return {
    showReviewModal,
    reviewData,
    openModal,
    closeModal,
    setReviewData,
    setShowReviewModal,
  };
}
