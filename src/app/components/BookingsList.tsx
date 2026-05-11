import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, User as UserIcon } from "lucide-react";
import { getBookings, getPCCenters, getUsers, type Booking, type PCCenter, type User } from "../../lib/dataService";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface EnrichedBooking extends Booking {
  centerName?: string;
  userName?: string;
}

export function BookingsList() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookingData = await getBookings();
        const centersData = await getPCCenters();
        const usersData = await getUsers();

        // Create maps for quick lookup
        const centerMap = new Map(centersData.map((c: PCCenter) => [c.id, c.name]));
        const userMap = new Map(usersData.map((u: User) => [u.id, u.name]));

        // Enrich bookings with names
        const enrichedBookings: EnrichedBooking[] = bookingData.map((booking: Booking) => ({
          ...booking,
          centerName: centerMap.get(booking.pcCenterId) || "Unknown",
          userName: (booking.userId ? userMap.get(booking.userId) : undefined) || "Unknown",
        }));

        setBookings(enrichedBookings);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading bookings...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="size-8 text-purple-500" />
        <h2 className="text-3xl font-bold text-white">Захиалгууд</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No bookings found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="size-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">
                          {booking.centerName}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <UserIcon className="size-4" />
                          <span>{booking.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={`capitalize border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
