import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { User, Calendar, Clock, MapPin, Star, LogOut, Edit, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserBookings, getPCCenters, cancelBooking, type Booking, type PCCenter } from "../../lib/dataService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [avatarHovered, setAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    setIsCancelling(true);
    try {
      await cancelBooking(cancelTargetId);
      setUserBookings((prev) =>
        prev.map((b) => (b.id === cancelTargetId ? { ...b, status: "cancelled" as const } : b))
      );
      toast.success("Захиалга амжилттай цуцлагдлаа.");
    } catch {
      toast.error("Цуцлахад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsCancelling(false);
      setCancelTargetId(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Зургийн хэмжээ 3MB-аас хэтрэхгүй байх ёстой");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ avatar: reader.result as string });
      toast.success("Профайл зураг шинэчлэгдлээ!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [centerMap, setCenterMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserBookings(user.id), getPCCenters()])
      .then(([bookings, centers]) => {
        setUserBookings(bookings);
        setCenterMap(new Map((centers as PCCenter[]).map((c) => [c.id, c.name])));
      })
      .catch((error) => console.error("Failed to load bookings:", error));
  }, [user]);

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

  const userData = {
    name: user?.name || "Batbold Ganbaatar",
    email: user?.email || "batbold@email.com",
    avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    memberSince: "January 2026",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Профайл</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-[#1a1a24] border-purple-500/30">
                  <CardContent className="pt-6 text-center">
                    <div
                      className="relative size-32 mx-auto mb-4 cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                      onMouseEnter={() => setAvatarHovered(true)}
                      onMouseLeave={() => setAvatarHovered(false)}
                    >
                      <Avatar className="size-32 border-4 border-purple-500/50 transition-opacity duration-200 group-hover:opacity-60">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-2xl bg-purple-600">{userData.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-full transition-opacity duration-200 ${avatarHovered ? "opacity-100" : "opacity-0"}`}>
                        <Camera className="size-7 text-white drop-shadow" />
                        <span className="text-white text-xs mt-1 font-medium drop-shadow">Солих</span>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <h2 className="text-2xl font-bold text-white mb-1">{userData.name}</h2>
                    <p className="text-gray-400 mb-4">{userData.email}</p>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 mb-6">
                      Хэрэглэгч болсон огноо {userData.memberSince}
                    </Badge>

                    <div className="space-y-3">
                      <div className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{userBookings.length}</div>
                        <div className="text-gray-400 text-sm">Нийт захиалга</div>
                      </div>
                      <div className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20">
                        <div className="text-3xl font-bold text-cyan-400 mb-1">
                          {userBookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length}
                        </div>
                        <div className="text-gray-400 text-sm">Хүлээгдэж буй захиалга</div>
                      </div>
                    </div>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                          <Edit className="size-4 mr-2" />
                          Профайл засах
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
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full mt-3 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="size-4 mr-2" />
                      Гарах
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bookings */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-[#1a1a24] border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Захиалгын түүх</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userBookings.length === 0 && (
                      <p className="text-center text-gray-500 py-8">Захиалга байхгүй байна</p>
                    )}
                    {userBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {centerMap.get(booking.pcCenterId) || "Gaming Center"}
                            </h3>
                            <Badge
                              className={
                                booking.status === 'confirmed'
                                  ? 'bg-green-600/20 text-green-300 border-green-500/50'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/50'
                                  : 'bg-gray-600/20 text-gray-300 border-gray-500/50'
                              }
                            >
                              {booking.status === 'confirmed' ? 'Баталгаажсан' : booking.status === 'pending' ? 'Хүлээгдэж байна' : 'Цуцлагдсан'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-400">
                              ₮{booking.totalPrice.toLocaleString()}
                            </div>
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
                            <MapPin className="size-4" />
                            <span>Суудал: {booking.seats.join(", ")}</span>
                          </div>
                        </div>

                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <div className="mt-3 pt-3 border-t border-purple-500/10">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCancelTargetId(booking.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/70"
                            >
                              Захиалга цуцлах
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="text-center pt-4">
                      <Link to="/">
                        <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                          Захиалга хийх
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={!!cancelTargetId} onOpenChange={(open) => { if (!open) setCancelTargetId(null); }}>
        <AlertDialogContent className="bg-[#1a1a24] border-red-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg">
              Захиалга цуцлах уу?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?
              Цуцалсан захиалгыг сэргээх боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-purple-500/30 text-gray-300 hover:bg-purple-500/10 bg-transparent"
              disabled={isCancelling}
            >
              Буцах
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Цуцалж байна..." : "Тийм, цуцлах"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
