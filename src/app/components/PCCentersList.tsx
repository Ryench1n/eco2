import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, MapPin, Users, DollarSign, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPCCenters, type PCCenter } from "../../lib/dataService";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function PCCentersList() {
  const navigate = useNavigate();
  const [centers, setCenters] = useState<PCCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "rating" | "price">("name");

  useEffect(() => {
    const loadCenters = async () => {
      try {
        const centersData = await getPCCenters();
        setCenters(centersData);
      } catch (error) {
        console.error("Failed to load PC centers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCenters();
  }, []);

  const getSortedCenters = () => {
    const sorted = [...centers];
    if (sortBy === "rating") {
      return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      return sorted.sort((a, b) => a.pricing.hall - b.pricing.hall);
    }
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading PC centers...</div>
      </div>
    );
  }

  const sortedCenters = getSortedCenters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Zap className="size-8 text-purple-500" />
          <h2 className="text-3xl font-bold text-white">PC Төвүүд</h2>
        </div>
        <div className="flex gap-2">
          {(["name", "rating", "price"] as const).map((option) => (
            <Button
              key={option}
              onClick={() => setSortBy(option)}
              className={`capitalize ${
                sortBy === option
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {option === "name" && "Нэр"}
              {option === "rating" && "Үнэлгээ"}
              {option === "price" && "Үнэ"}
            </Button>
          ))}
        </div>
      </div>

      {sortedCenters.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No PC centers found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedCenters.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image */}
                    <div className="md:w-48 md:h-48 flex-shrink-0">
                      <img
                        src={center.image}
                        alt={center.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {center.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <MapPin className="size-4" />
                            <span>{center.address}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end mb-2">
                            <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg font-bold text-white">
                              {center.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            ({center.reviewCount} үнэлгээ)
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {center.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-purple-500/10 rounded p-3 border border-purple-500/20">
                          <div className="text-gray-400 text-xs mb-1">Нийт суудал</div>
                          <div className="text-white font-bold">{center.totalSeats}</div>
                        </div>
                        <div className="bg-cyan-500/10 rounded p-3 border border-cyan-500/20">
                          <div className="text-gray-400 text-xs mb-1">Hall үнэ</div>
                          <div className="text-white font-bold">{center.pricing.hall}₮</div>
                        </div>
                        <div className="bg-purple-500/10 rounded p-3 border border-purple-500/20">
                          <div className="text-gray-400 text-xs mb-1">VIP үнэ</div>
                          <div className="text-white font-bold">{center.pricing.vip}₮</div>
                        </div>
                      </div>

                      {/* Equipment */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Төхөөрөмж:</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "CPU", value: center.gears.cpu },
                            { label: "GPU", value: center.gears.gpu },
                            { label: "RAM", value: center.gears.ram },
                          ].map((gear, idx) => (
                            <Badge
                              key={idx}
                              className="bg-gray-700 text-gray-200 text-xs border-0"
                            >
                              {gear.label}: {gear.value}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigate(`/pc/${center.id}`)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                        >
                          Дэлгэрэнгүй үзэх
                        </Button>
                        <Button
                          onClick={() => navigate(`/booking/${center.id}`)}
                          variant="outline"
                          className="flex-1 border-purple-500/30 text-gray-300 hover:bg-purple-500/10"
                        >
                          Захиалга хийх
                        </Button>
                      </div>
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
