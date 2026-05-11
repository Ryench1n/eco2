import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { pcCenters, generateSeats, Seat } from "../data/mockData";
import { saveBooking } from "../../lib/dataService";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const pcCenter = pcCenters.find((pc) => pc.id === id);
  const seats = useMemo(() => pcCenter ? generateSeats(pcCenter.id) : [], [pcCenter]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);

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

  const toggleSeat = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const price = pcCenter.pricing[seat.type];
      return total + price * duration;
    }, 0);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || selectedSeats.length === 0) {
      toast.error("Захиалгын мэдээллийг бүрэн оруулна уу");
      return;
    }

    toast.loading("Захиалга боловсруулж байна...", { id: "booking" });
    try {
      await saveBooking({
        userId: user?.id,
        pcCenterId: id!,
        date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        time: selectedTime,
        duration,
        seats: selectedSeats.map((s) => `${s.number}`),
        totalPrice: calculateTotal(),
      });
      toast.success("Захиалга амжилттай бүртгэгдлээ!", { id: "booking" });
      setBookingComplete(true);
    } catch {
      toast.error("Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.", { id: "booking" });
    }
  };

  const timeSlots = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#1a1a24] border-purple-500/30 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="size-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Захиалга баталгаажлаа!</h2>
                <p className="text-gray-400">Таны захиалсан захиалга амжилттай баталгаажсан байна.</p>
              </div>
              
              <div className="bg-[#0f0f17] rounded-lg p-6 mb-6 border border-purple-500/20 text-left">
                <h3 className="font-semibold text-white mb-4">Захиалгын дэлгэрэнгүй</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Тоглоомын төв:</span>
                    <span className="text-white">{pcCenter.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Огноо:</span>
                    <span className="text-white">{selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}` : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Цаг:</span>
                    <span className="text-white">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Хугацаа:</span>
                    <span className="text-white">{duration} цаг</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Суудал:</span>
                    <span className="text-white">{selectedSeats.map(s => s.number).join(", ")}</span>
                  </div>
                  <Separator className="bg-purple-500/20 my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Нийт төлбөр:</span>
                    <span className="text-purple-400">₮{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/pc/${id}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  PC дэлгэрэнгүй
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                  Нүүр хуудас руу буцах
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-purple-400 transition-colors">Нүүр хуудас</Link>
          <ChevronRight className="size-4" />
          <Link to={`/pc/${id}`} className="hover:text-purple-400 transition-colors">{pcCenter.name}</Link>
          <ChevronRight className="size-4" />
          <span className="text-white">Захиалга</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Захиалга</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalendarIcon className="size-6 text-purple-500" />
                    Огноо болон Цаг сонгох
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-3 block">Огноо</Label>
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
  className="rounded-md border border-purple-500/30 bg-[#0f0f17] p-3 shadow-lg shadow-purple-500/5"
  classNames={{
    day_selected: 
      "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white rounded-md",
    day_today: "bg-purple-500/10 text-purple-400 font-bold border border-purple-500/30", 
    day: "text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 transition-all rounded-md w-9 h-9 flex items-center justify-center p-0 font-normal aria-selected:opacity-100", // Энгийн өдрүүд
    day_disabled: "text-gray-600 opacity-20 cursor-not-allowed", 
    day_outside: "text-gray-600 opacity-30", 
    head_cell: "text-gray-500 font-medium text-[0.8rem] uppercase pb-2", 
    nav_button: "border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 transition-colors rounded-md p-1", 
    caption: "flex justify-center pt-1 relative items-center text-gray-200 font-semibold mb-2", 
  }}
/>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white mb-3 block">Цаг сонгох</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger className="bg-[#0f0f17] border-purple-500/30 text-white">
                            <Clock className="size-4 mr-2" />
                            <SelectValue placeholder="Цаг оруулах" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a24] border-purple-500/30">
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time} className="text-gray-300">
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white mb-3 block">Захиалах хугацаа (цаг)</Label>
                        <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                          <SelectTrigger className="bg-[#0f0f17] border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a24] border-purple-500/30">
                            {[1, 2, 3, 4, 5, 6].map((hours) => (
                              <SelectItem key={hours} value={hours.toString()} className="text-gray-300">
                                {hours} цаг{hours > 1 ? '' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seat Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Суудал сонгох</CardTitle>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <div className="flex items-center gap-2">
                      <div className="size-4 bg-green-500/20 border-2 border-green-500 rounded"></div>
                      <span className="text-gray-400">Сонгох боломжтой</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 bg-purple-500/20 border-2 border-purple-500 rounded"></div>
                      <span className="text-gray-400">Таны сонгосон</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 bg-gray-600/20 border-2 border-gray-600 rounded"></div>
                      <span className="text-gray-400">Сонгох боломжгүй</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Hall Seats */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      Hall Seats
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                        ₮{pcCenter.pricing.hall}/цаг
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {seats.filter(s => s.type === 'hall').map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={!seat.isAvailable}
                          className={`
                            aspect-square rounded-lg border-2 font-semibold text-sm
                            transition-all duration-200 hover:scale-105
                            ${!seat.isAvailable
                              ? 'bg-gray-600/20 border-gray-600 text-gray-600 cursor-not-allowed'
                              : selectedSeats.find(s => s.id === seat.id)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-green-500/20 border-green-500 text-green-300 hover:bg-green-500/30'
                            }
                          `}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VIP Seats */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      VIP Seats
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                        ₮{pcCenter.pricing.vip}/цаг
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {seats.filter(s => s.type === 'vip').map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={!seat.isAvailable}
                          className={`
                            aspect-square rounded-lg border-2 font-semibold text-sm
                            transition-all duration-200 hover:scale-105
                            ${!seat.isAvailable
                              ? 'bg-gray-600/20 border-gray-600 text-gray-600 cursor-not-allowed'
                              : selectedSeats.find(s => s.id === seat.id)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-green-500/20 border-green-500 text-green-300 hover:bg-green-500/30'
                            }
                          `}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stage Seats */}
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      Stage Seats
                      <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
                        ₮{pcCenter.pricing.stage}/цаг
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {seats.filter(s => s.type === 'stage').map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={!seat.isAvailable}
                          className={`
                            aspect-square rounded-lg border-2 font-semibold text-sm
                            transition-all duration-200 hover:scale-105
                            ${!seat.isAvailable
                              ? 'bg-gray-600/20 border-gray-600 text-gray-600 cursor-not-allowed'
                              : selectedSeats.find(s => s.id === seat.id)
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-green-500/20 border-green-500 text-green-300 hover:bg-green-500/30'
                            }
                          `}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="size-6 text-purple-500" />
                    Захиалгын хураангуй
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-white mb-3">{pcCenter.name}</h4>
                    <div className="space-y-2 text-sm">
                      {selectedDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Огноо:</span>
                          <span className="text-white">{selectedDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Цаг:</span>
                          <span className="text-white">{selectedTime}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Хугацаа:</span>
                        <span className="text-white">{duration} цаг</span>
                      </div>
                    </div>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="bg-[#0f0f17] rounded-lg p-4 border border-purple-500/20">
                      <h4 className="font-semibold text-white mb-3">Сонгогдсон суудал</h4>
                      <div className="space-y-2">
                        {selectedSeats.map((seat) => (
                          <div key={seat.id} className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              Суудал {seat.number} ({seat.type.toUpperCase()})
                            </span>
                            <span className="text-white">
                              ₮{(pcCenter.pricing[seat.type] * duration).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="bg-purple-500/20" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Нийт төлбөр:</span>
                    <span className="text-purple-400 text-2xl">
                      ₮{calculateTotal().toLocaleString()}
                    </span>
                  </div>

                  {selectedSeats.length === 0 && (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex gap-2">
                      <Info className="size-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-cyan-300 text-sm">
                        Дор хаяж 1 суудал сонгохыг анхаарна уу
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || selectedSeats.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="size-5 mr-2" />
                    Төлбөр төлөх
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
