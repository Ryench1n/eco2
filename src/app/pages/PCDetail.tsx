import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Phone,
  Facebook,
  Clock,
  Monitor,
  Cpu,
  Gamepad2,
  Calendar,
  ChevronRight,
  Send,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  getPCCenterById,
  getReviewsByCenterId,
  addReview,
  type PCCenter,
  type Review,
} from "../../lib/dataService";

export function PCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [pcCenter, setPcCenter] = useState<PCCenter | null>(null);
  const [pcReviews, setPcReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getPCCenterById(id), getReviewsByCenterId(id)])
      .then(([center, reviews]) => {
        setPcCenter(center ?? null);
        setPcReviews(reviews);
      })
      .catch(() => setPcCenter(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!pcCenter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">PC Center Not Found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast.error("Сэтгэгдэл үлдээхийн тулд нэвтрэх шаардлагатай");
      navigate('/login');
      return;
    }
    if (rating === 0) {
      toast.error("Үнэлгээ сонгоно уу");
      return;
    }
    if (!comment.trim()) {
      toast.error("Сэтгэгдэл бичнэ үү");
      return;
    }

    setSubmitting(true);
    try {
      const newReview = await addReview({
        pcCenterId: pcCenter.id,
        userName: user?.name || "Хэрэглэгч",
        userAvatar: user?.avatar || "",
        rating,
        comment: comment.trim(),
      });
      setPcReviews((prev) => [newReview, ...prev]);
      toast.success("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
      setRating(0);
      setComment("");
    } catch {
      toast.error("Сэтгэгдэл илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <ChevronRight className="size-4" />
          <span className="text-white">{pcCenter.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={pcCenter.image}
                    alt={pcCenter.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a24] to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-4xl font-bold text-white mb-3">{pcCenter.name}</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0 text-base py-1 px-3">
                        <Star className="size-4 mr-1 fill-current" />
                        {pcCenter.rating} ({pcCenter.reviewCount} сэтгэгдэл)
                      </Badge>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="size-4" />
                        <span className="text-sm">{pcCenter.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gamepad2 className="size-6 text-purple-500" />
                    Танилцуулга
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{pcCenter.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gears/Setup Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Monitor className="size-6 text-purple-500" />
                    Төхөөрөмж
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Cpu className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">CPU</div>
                        <div className="text-white font-medium">{pcCenter.gears.cpu}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Monitor className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">GPU</div>
                        <div className="text-white font-medium">{pcCenter.gears.gpu}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Monitor className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">RAM</div>
                        <div className="text-white font-medium">{pcCenter.gears.ram}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Monitor className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">Monitor</div>
                        <div className="text-white font-medium">{pcCenter.gears.monitor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Monitor className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">Keyboard</div>
                        <div className="text-white font-medium">{pcCenter.gears.keyboard}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                      <Monitor className="size-8 text-cyan-500" />
                      <div>
                        <div className="text-xs text-gray-500">Mouse</div>
                        <div className="text-white font-medium">{pcCenter.gears.mouse}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Add Review Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="size-6 text-purple-500" />
                    Үнэлгээ өгөх
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Таны үнэлгээ</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onMouseEnter={() => setHoveredRating(value)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(value)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`size-8 transition-colors ${
                                  value <= (hoveredRating || rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                          {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-400">
                              {rating} од
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Сэтгэгдэл</label>
                        <Textarea
                          placeholder="Энэ тоглоомын төвийн тухай таны санал бодол..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="bg-[#0f0f17] border-purple-500/30 text-white min-h-24"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      >
                        {submitting ? (
                          <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="size-4 mr-2" />
                        )}
                        {submitting ? "Илгээж байна..." : "Сэтгэгдэл илгээх"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400 mb-4">Сэтгэгдэл үлдээхийн тулд нэвтэрнэ үү</p>
                      <Button
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        Нэвтрэх
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="size-6 text-purple-500" />
                    Хэрэглэгчийн сэтгэгдэл ({pcReviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pcReviews.length > 0 ? (
                      pcReviews.map((review) => (
                        <div key={review.id} className="p-4 bg-[#0f0f17] rounded-lg border border-purple-500/20">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar} alt={review.userName} />
                              <AvatarFallback>{review.userName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-white">{review.userName}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`size-4 ${
                                        i < review.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-8">Одоогоор сэтгэгдэл байхгүй байна</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact & Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Холбоо барих</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <a
                      href={`tel:${pcCenter.contactPhone}`}
                      className="flex items-center gap-3 p-3 bg-[#0f0f17] rounded-lg hover:bg-purple-500/10 transition-colors border border-purple-500/20"
                    >
                      <Phone className="size-5 text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">Утас</div>
                        <div className="text-white text-sm">{pcCenter.contactPhone}</div>
                      </div>
                    </a>
                    <a
                      href={`https://${pcCenter.facebookPage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#0f0f17] rounded-lg hover:bg-purple-500/10 transition-colors border border-purple-500/20"
                    >
                      <Facebook className="size-5 text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">Facebook</div>
                        <div className="text-white text-sm">{pcCenter.facebookPage}</div>
                      </div>
                    </a>
                  </div>

                  <Separator className="bg-purple-500/20" />

                  {/* Opening Hours */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="size-5 text-purple-500" />
                      <h3 className="font-semibold text-white">Цагийн хуваарь</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {Object.entries(pcCenter.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{day}</span>
                          <span className="text-white">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-purple-500/20" />

                  {/* Pricing */}
                  <div>
                    <h3 className="font-semibold text-white mb-3">Үнэ (цаг тутам)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-[#0f0f17] rounded border border-purple-500/20">
                        <span className="text-gray-400">Hall</span>
                        <span className="text-white font-semibold">₮{pcCenter.pricing.hall}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-[#0f0f17] rounded border border-purple-500/20">
                        <span className="text-gray-400">VIP</span>
                        <span className="text-purple-400 font-semibold">₮{pcCenter.pricing.vip}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-[#0f0f17] rounded border border-purple-500/20">
                        <span className="text-gray-400">Stage</span>
                        <span className="text-cyan-400 font-semibold">₮{pcCenter.pricing.stage}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate(`/booking/${pcCenter.id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg py-6"
                  >
                    <Calendar className="size-5 mr-2" />
                    Захиалах
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
