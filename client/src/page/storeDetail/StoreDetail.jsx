import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star, ArrowLeft, Loader2 } from "lucide-react";
import {
  fetchStoreById,
  fetchUserRating,
  submitOrUpdateRating,
} from "../../api/store";

const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);

  // ✅ Fetch store info and user rating
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [storeData, userRate] = await Promise.all([
          fetchStoreById(storeId),
          fetchUserRating(storeId),
        ]);

        if (!storeData?.store) {
          setError("Store not found");
          return;
        }

        setStore(storeData.store);
        setAverageRating(storeData.averageRating || 0);
        setUserRating(userRate?.rating || 0);
      } catch (err) {
        console.error("Error fetching store:", err);
        setError("Failed to load store details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [storeId]);

  // ✅ Submit or update rating and re-fetch latest data
  const handleSubmitRating = async (ratingValue) => {
    try {
      setSubmitting(true);

      await submitOrUpdateRating(storeId, ratingValue);

      // Re-fetch latest data to sync with backend
      const [updatedStore, updatedUserRate] = await Promise.all([
        fetchStoreById(storeId),
        fetchUserRating(storeId),
      ]);

      setAverageRating(updatedStore.averageRating || 0);
      setUserRating(updatedUserRate?.rating || ratingValue);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Something went wrong while submitting your rating.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, setter = null, hoverSetter = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => interactive && setter && setter(star)}
          onMouseEnter={() => interactive && hoverSetter && hoverSetter(star)}
          onMouseLeave={() => interactive && hoverSetter && hoverSetter(0)}
          className={`w-8 h-8 cursor-pointer transition ${
            star <= (interactive ? hoverRating || rating : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading store details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>{error}</p>
        <Button variant="outline" onClick={() => navigate("/user")} className="mt-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>
      </div>
    );

  if (!store) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate("/user")}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Button>

        {/* Store Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{store.name}</CardTitle>
            <p className="text-gray-600">{store.email}</p>
            <p className="text-gray-600">{store.address}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {renderStars(averageRating || 0)}
              <span className="font-medium text-gray-800">
                {averageRating ? `${averageRating.toFixed(1)}/5` : "No rating yet"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rating Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {userRating ? "Your Rating" : "Rate This Store"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {userRating ? (
              <>
                <div className="mb-4">{renderStars(userRating)}</div>
                <Button
                  disabled={submitting}
                  onClick={() => {
                    setNewRating(userRating);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Loading..." : "Update Rating"}
                </Button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  {renderStars(userRating, true, setUserRating, setHoverRating)}
                </div>
                <Button
                  disabled={userRating === 0 || submitting}
                  onClick={() => handleSubmitRating(userRating)}
                  className="bg-black hover:bg-gray-800 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit Rating"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Rating Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Rating</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {renderStars(newRating, true, setNewRating, setHoverRating)}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              disabled={newRating === 0 || submitting}
              onClick={() => handleSubmitRating(newRating)}
              className="bg-black hover:bg-gray-800 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Updating..." : "Update Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreDetails;
