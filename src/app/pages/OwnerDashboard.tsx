import { motion } from "motion/react";
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  User,
  Edit,
  LogOut
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPCCentersByOwner, getBookingsByPCCenterIds, type PCCenter, type Booking } from "../../lib/dataService";

export function OwnerDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [myPCCenters, setMyPCCenters] = useState<PCCenter[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    getPCCentersByOwner(user.id).then((centers) => {
      setMyPCCenters(centers);
      const ids = centers.map((c) => c.id);
      getBookingsByPCCenterIds(ids).then((bookings) => {
        const sorted = [...bookings].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentBookings(sorted.slice(0, 10));
      });
    });
  }, [user?.id]);

  // Check if user is owner and verified
  if (!user || user.type !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Зөвхөн эзэмшигчдэд зориулагдсан</h2>
          <p className="text-gray-400 mb-6">Та эзэмшигчийн эрхээр нэвтрэх шаардлагатай.</p>
          <Button onClick={() => navigate('/login/owner')} className="bg-gradient-to-r from-purple-600 to-cyan-600">
            Эзэмшигчээр нэвтрэх
          </Button>
        </div>
      </div>
    );
  }

  // Check if owner is verified
  if (!user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 mb-4">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Бүртгэл баталгаажаагүй</h2>
          <p className="text-gray-400 mb-6">
            Таны бүртгэл боловсруулалтанд байна. PC төв нэмж эхлүүлснээр таны эрх идэвхжих болно.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/owner/add-pc')} 
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              PC Төв Нэмэх
            </Button>
            <Button 
              onClick={() => {
                logout();
                navigate('/');
              }} 
              variant="outline"
              className="w-full border-purple-500/30 text-gray-300"
            >
              Гарах
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Амжилттай гарлаа!");
    navigate("/");
  };

  const handleUpdateName = () => {
    if (displayName.trim()) {
      updateUser({ name: displayName });
      toast.success("Нэр амжилттай шинэчлэгдлээ!");
      setIsEditDialogOpen(false);
    }
  };

  const stats = [
    {
      title: "Total Bookings",
      value: "248",
      change: "+12%",
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      title: "Revenue (This Month)",
      value: "₮2.4M",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+23%",
      icon: Users,
      color: "text-cyan-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.3",
      icon: Star,
      color: "text-yellow-500",
    },
  ];


  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your gaming center.</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/owner/add-pc')}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Edit className="size-4 mr-2" />
              Шинэ PC Төв Нэмэх
            </Button>

            {/* Quick Profile Section */}
            <Card className="bg-[#1a1a24] border-purple-500/30 md:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border-2 border-purple-500/50">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-purple-600">{user?.name?.[0] || 'O'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{user?.name || "Эзэмшигч"}</h3>
                    <p className="text-sm text-gray-400 truncate">{user?.email || ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                        >
                          <Edit className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1a1a24] border-purple-500/30 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-white">Профайл засах</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Харагдах нэрээ солих
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName" className="text-gray-300">
                              Харагдах нэр
                            </Label>
                            <Input
                              id="displayName"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="bg-[#0f0f17] border-purple-500/30 text-white"
                              placeholder="Нэрээ оруулна уу"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="flex-1 border-purple-500/30 text-gray-300 hover:bg-purple-500/10"
                          >
                            Болих
                          </Button>
                          <Button
                            onClick={handleUpdateName}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                          >
                            Хадгалах
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleLogout}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-[#0f0f17] border border-purple-500/20`}>
                      <stat.icon className={`size-6 ${stat.color}`} />
                    </div>
                    <Badge className="bg-green-600/20 text-green-300 border-green-500/50">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* My PC Centers */}
        {myPCCenters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-8"
          >
            <Card className="bg-[#1a1a24] border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="size-6 text-purple-500" />
                  Миний PC Төвүүд
                  <Badge className="ml-2 bg-purple-600/20 text-purple-300 border-purple-500/50">
                    {myPCCenters.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {myPCCenters.map((center) => (
                    <div
                      key={center.id}
                      className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white leading-tight">{center.name}</h4>
                        <Badge className="shrink-0 bg-green-600/20 text-green-300 border-green-500/50 text-xs">
                          Идэвхтэй
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <User className="size-3" />
                        {center.address}
                      </p>

                      {/* Seat counts */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { label: "Hall", count: center.seatCounts?.hall ?? "—", color: "text-blue-400" },
                          { label: "VIP", count: center.seatCounts?.vip ?? "—", color: "text-purple-400" },
                          { label: "Stage", count: center.seatCounts?.stage ?? "—", color: "text-cyan-400" },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="bg-[#1a1a24] rounded p-2">
                            <p className={`text-sm font-bold ${color}`}>{count}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Total seats */}
                      <p className="text-xs text-gray-400">
                        Нийт суудал:{" "}
                        <span className="text-white font-semibold">{center.totalSeats}</span>
                      </p>

                      {/* Pricing */}
                      <div className="border-t border-purple-500/10 pt-2 space-y-1">
                        {[
                          { label: "Hall", price: center.pricing.hall },
                          { label: "VIP", price: center.pricing.vip },
                          { label: "Stage", price: center.pricing.stage },
                        ].map(({ label, price }) => (
                          <div key={label} className="flex justify-between text-xs">
                            <span className="text-gray-400">{label}</span>
                            <span className="text-white">₮{price.toLocaleString()}/цаг</span>
                          </div>
                        ))}
                      </div>

                      {center.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="size-3 fill-yellow-400" />
                          <span>{center.rating}</span>
                          <span className="text-gray-500">({center.reviewCount} үнэлгээ)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#1a1a24] border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="size-6 text-purple-500" />
                  Хүлээгдэж буй захиалгууд
                  {recentBookings.length > 0 && (
                    <Badge className="ml-1 bg-yellow-600/20 text-yellow-300 border-yellow-500/50">
                      {recentBookings.filter((b) => b.status === "pending").length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Calendar className="size-10 mx-auto mb-3 opacity-30" />
                    <p>Одоогоор захиалга байхгүй байна</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => {
                      const center = myPCCenters.find((c) => c.id === booking.pcCenterId);
                      return (
                        <div
                          key={booking.id}
                          className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-white mb-1">
                                {center?.name ?? booking.pcCenterId}
                              </h4>
                              <Badge
                                className={
                                  booking.status === "confirmed"
                                    ? "bg-green-600/20 text-green-300 border-green-500/50"
                                    : booking.status === "pending"
                                    ? "bg-yellow-600/20 text-yellow-300 border-yellow-500/50"
                                    : "bg-gray-600/20 text-gray-300 border-gray-500/50"
                                }
                              >
                                {booking.status === "confirmed"
                                  ? "Баталгаажсан"
                                  : booking.status === "pending"
                                  ? "Хүлээгдэж байна"
                                  : "Цуцлагдсан"}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-purple-400">
                                ₮{booking.totalPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">{booking.duration} цаг</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar className="size-4" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="size-4" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 col-span-2">
                              <Users className="size-4" />
                              <span>Суудал: {booking.seats.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Occupancy Rate */}
            <Card className="bg-[#1a1a24] border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <TrendingUp className="size-5 text-purple-500" />
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-400 mb-2">78%</div>
                  <p className="text-gray-400 text-sm">Current occupancy</p>
                  <div className="mt-4 h-2 bg-[#0f0f17] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Times */}
            <Card className="bg-[#1a1a24] border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-purple-500" />
                  Popular Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Weekdays (10-18)</span>
                      <span className="text-white">65%</span>
                    </div>
                    <div className="h-2 bg-[#0f0f17] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-600 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Weekdays (18-23)</span>
                      <span className="text-white">85%</span>
                    </div>
                    <div className="h-2 bg-[#0f0f17] rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Weekends</span>
                      <span className="text-white">92%</span>
                    </div>
                    <div className="h-2 bg-[#0f0f17] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
