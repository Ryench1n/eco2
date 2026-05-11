import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, MapPin, TrendingUp } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getPCCenters, type PCCenter } from "../../lib/dataService";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useSearch } from "../context/SearchContext";

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, districtFilter, ratingFilter, sortBy } = useSearch();
  const [centers, setCenters] = useState<PCCenter[]>([]);

  useEffect(() => {
    getPCCenters().then(setCenters);
  }, []);

  let filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === "all" || center.address.toLowerCase().includes(districtFilter.toLowerCase());
    const matchesRating = ratingFilter === null || center.rating >= ratingFilter;
    return matchesSearch && matchesDistrict && matchesRating;
  });

  // Sort centers based on selected option
  if (sortBy === "price-low") {
    filteredCenters = [...filteredCenters].sort((a, b) => a.pricing.hall - b.pricing.hall);
  } else if (sortBy === "price-high") {
    filteredCenters = [...filteredCenters].sort((a, b) => b.pricing.hall - a.pricing.hall);
  } else if (sortBy === "rating") {
    filteredCenters = [...filteredCenters].sort((a, b) => b.rating - a.rating);
  }

  const topRatedCenters = [...centers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-cyan-900/40 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Play smart, Book fast
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="size-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-white">Хамгийн их захиалагдсан төвүүд</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-[#1a1a24] border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0">
                        <Star className="size-3 mr-1 fill-current" />
                        {center.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{center.name}</h3>
                    <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
                      <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{center.reviewCount} үнэлгээ</span>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate(`/pc/${center.id}`)}
                      >
                        Дэлгэрэнгүй
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Gaming Centers */}
      <section className="py-16 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f17]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">Бүх тоглоомын төвүүд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCenters.map((center) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1a1a24] border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0">
                        <Star className="size-3 mr-1 fill-current" />
                        {center.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-1">{center.name}</h3>
                    <div className="flex items-start gap-1 text-gray-400 text-xs mb-3">
                      <MapPin className="size-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{center.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{center.reviewCount} үнэлгээ</span>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => navigate(`/pc/${center.id}`)}
                      >
                        Дэлгэрэнгүй
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-[#0f0f17]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">ECO-н тухай</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              ECO нь Улаанбаатарын шилдэг компьютер тоглоомын төвүүдээс тоглох цагаа захиалах платформ юм.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-[#1a1a24] p-6 rounded-lg border border-purple-500/30">
                <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
                <div className="text-gray-400">Тоглоомын төв</div>
              </div>
              <div className="bg-[#1a1a24] p-6 rounded-lg border border-purple-500/30">
                <div className="text-4xl font-bold text-cyan-500 mb-2">10,000+</div>
                <div className="text-gray-400">Идэвхтэй хэрэглэгчид</div>
              </div>
              <div className="bg-[#1a1a24] p-6 rounded-lg border border-purple-500/30">
                <div className="text-4xl font-bold text-purple-500 mb-2">4.8★</div>
                <div className="text-gray-400">Дундаж үнэлгээ</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}