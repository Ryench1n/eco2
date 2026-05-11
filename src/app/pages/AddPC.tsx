import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Upload, MapPin, Phone, Facebook, Clock, DollarSign, Monitor, Cpu, Keyboard, X, Image as ImageIcon, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../context/AuthContext";
import { addPCCenter, type PCCenter } from "../../lib/dataService";
import { toast } from "sonner";

export function AddPC() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "Sukhbaatar",
    description: "",
    hallSeats: "",
    vipSeats: "",
    stageSeats: "",
    phone: "",
    facebook: "",
    // Gears
    cpu: "",
    gpu: "",
    ram: "",
    monitor: "",
    keyboard: "",
    mouse: "",
    // Pricing
    hallPrice: "",
    vipPrice: "",
    stagePrice: "",
    // Opening hours
    openingHours: {
      Monday: "10:00 - 23:00",
      Tuesday: "10:00 - 23:00",
      Wednesday: "10:00 - 23:00",
      Thursday: "10:00 - 23:00",
      Friday: "10:00 - 01:00",
      Saturday: "10:00 - 01:00",
      Sunday: "10:00 - 23:00",
    },
  });

  // Check if user is owner
  if (!user || user.type !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Зөвхөн эзэмшигчдэд зориулагдсан</h2>
          <p className="text-gray-400 mb-6">Та PC төв нэмэхийн тулд эзэмшигчийн эрхээр нэвтрэх шаардлагатай.</p>
          <Button onClick={() => navigate('/login/owner')} className="bg-gradient-to-r from-purple-600 to-cyan-600">
            Эзэмшигчээр нэвтрэх
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("PC төвийн нэрийг оруулна уу");
      setIsLoading(false);
      return;
    }
    if (!formData.address.trim()) {
      setError("Хаягийг оруулна уу");
      setIsLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError("Утасны дугаарыг оруулна уу");
      setIsLoading(false);
      return;
    }
    const hallSeats = parseInt(formData.hallSeats) || 0;
    const vipSeats = parseInt(formData.vipSeats) || 0;
    const stageSeats = parseInt(formData.stageSeats) || 0;
    if (hallSeats <= 0 && vipSeats <= 0 && stageSeats <= 0) {
      setError("Дор хаяж нэг төрлийн суудлын тоог оруулна уу");
      setIsLoading(false);
      return;
    }
    if (!formData.hallPrice || parseInt(formData.hallPrice) <= 0) {
      setError("Hall үнийг зөв оруулна уу");
      setIsLoading(false);
      return;
    }

    try {
      // Create PC center object
      const newPCCenter: Omit<PCCenter, 'id'> = {
        ownerId: user.id,
        name: formData.name.trim(),
        address: `${formData.district} дүүрэг, ${formData.address.trim()}`,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80", // Default image
        totalSeats: hallSeats + vipSeats + stageSeats,
        seatCounts: { hall: hallSeats, vip: vipSeats, stage: stageSeats },
        rating: 0,
        reviewCount: 0,
        description: formData.description.trim(),
        gears: {
          cpu: formData.cpu.trim() || "Intel Core i7",
          gpu: formData.gpu.trim() || "NVIDIA RTX 3070",
          ram: formData.ram.trim() || "16GB DDR4",
          monitor: formData.monitor.trim() || "144Hz Gaming Monitor",
          keyboard: formData.keyboard.trim() || "RGB Gaming Keyboard",
          mouse: formData.mouse.trim() || "Gaming Mouse",
          headset: "Gaming Headset",
        },
        contactPhone: formData.phone.trim(),
        facebookPage: formData.facebook.trim(),
        openingHours: {
          monday: formData.openingHours.Monday,
          tuesday: formData.openingHours.Tuesday,
          wednesday: formData.openingHours.Wednesday,
          thursday: formData.openingHours.Thursday,
          friday: formData.openingHours.Friday,
          saturday: formData.openingHours.Saturday,
          sunday: formData.openingHours.Sunday,
        },
        pricing: {
          hall: parseInt(formData.hallPrice),
          vip: parseInt(formData.vipPrice) || parseInt(formData.hallPrice) + 2000,
          stage: parseInt(formData.stagePrice) || parseInt(formData.hallPrice) + 4000,
        },
      };

      // Save to database/storage
      await addPCCenter(newPCCenter as PCCenter);

      // Mark owner as verified after adding first PC
      if (user && !user.isVerified) {
        updateUser({ isVerified: true });
      }

      // Success message and navigate to dashboard
      toast.success("PC төв амжилттай нэмэгдлээ!");
      navigate('/owner/dashboard');
    } catch (err) {
      console.error('Error adding PC center:', err);
      setError('PC төв нэмэхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-purple-950/10 to-[#0a0a0f] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Шинэ PC Төв Нэмэх
            </h1>
            <p className="text-gray-400">Та тоглоомын төвийн мэдээллийг оруулна уу</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-[#1a1a24] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Monitor className="size-5 text-purple-400" />
                Үндсэн мэдээлэл
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Төвийн нэр *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dragon Gaming Lounge"
                    className="mt-1 bg-[#0f0f17] border-purple-500/30 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="text-gray-300">Хаяг *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="15-р байр"
                        className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="district" className="text-gray-300">Дүүрэг *</Label>
                    <select
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="mt-1 w-full px-3 py-2 bg-[#0f0f17] border border-purple-500/30 rounded-md text-white"
                    >
                      <option value="Sukhbaatar">Сүхбаатар</option>
                      <option value="Khan-Uul">Хан-Уул</option>
                      <option value="Bayanzurkh">Баянзүрх</option>
                      <option value="Songino">Сонгинохайрхан</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2 mb-2">
                    <Users className="size-4 text-purple-400" />
                    Суудлын тоо (төрлөөр) *
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'hallSeats', label: 'Hall', color: 'text-blue-400' },
                      { id: 'vipSeats', label: 'VIP', color: 'text-purple-400' },
                      { id: 'stageSeats', label: 'Stage', color: 'text-cyan-400' },
                    ].map(({ id, label, color }) => (
                      <div key={id}>
                        <Label htmlFor={id} className={`text-xs font-semibold ${color} mb-1 block`}>{label}</Label>
                        <Input
                          id={id}
                          type="number"
                          min={0}
                          value={formData[id as 'hallSeats' | 'vipSeats' | 'stageSeats']}
                          onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                          placeholder="0"
                          className="bg-[#0f0f17] border-purple-500/30 text-white text-center"
                        />
                      </div>
                    ))}
                  </div>
                  {(formData.hallSeats || formData.vipSeats || formData.stageSeats) && (
                    <p className="mt-2 text-sm text-gray-400">
                      Нийт:{" "}
                      <span className="text-white font-semibold">
                        {(parseInt(formData.hallSeats) || 0) +
                          (parseInt(formData.vipSeats) || 0) +
                          (parseInt(formData.stageSeats) || 0)}{" "}
                        суудал
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Танилцуулга</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Таны тоглоомын төвийн тухай товч мэдээлэл..."
                    className="mt-1 bg-[#0f0f17] border-purple-500/30 text-white min-h-24"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[#1a1a24] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Phone className="size-5 text-cyan-400" />
                Холбоо барих
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-gray-300">Утасны дугаар *</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+976 7777-8888"
                      className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebook" className="text-gray-300">Facebook хуудас</Label>
                  <div className="relative mt-1">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="fb.com/yourpage"
                      className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Specs */}
            <div className="bg-[#1a1a24] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Cpu className="size-5 text-purple-400" />
                Төхөөрөмж
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'cpu', label: 'CPU', placeholder: 'Intel Core i9-13900K', icon: Cpu },
                  { id: 'gpu', label: 'GPU', placeholder: 'NVIDIA RTX 4080', icon: Monitor },
                  { id: 'ram', label: 'RAM', placeholder: '32GB DDR5', icon: Cpu },
                  { id: 'monitor', label: 'Monitor', placeholder: 'ASUS ROG Swift 27" 240Hz', icon: Monitor },
                  { id: 'keyboard', label: 'Keyboard', placeholder: 'Razer BlackWidow V3', icon: Keyboard },
                  { id: 'mouse', label: 'Mouse', placeholder: 'Logitech G Pro', icon: Monitor },
                ].map(({ id, label, placeholder, icon: Icon }) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-gray-300">{label}</Label>
                    <div className="relative mt-1">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id={id}
                        value={formData[id as keyof typeof formData] as string}
                        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                        placeholder={placeholder}
                        className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#1a1a24] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="size-5 text-cyan-400" />
                Үнэ (цаг тутам, ₮)
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'hallPrice', label: 'Hall', placeholder: '3000' },
                  { id: 'vipPrice', label: 'VIP', placeholder: '5000' },
                  { id: 'stagePrice', label: 'Stage', placeholder: '7000' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <Label htmlFor={id} className="text-gray-300">{label} *</Label>
                    <Input
                      id={id}
                      type="number"
                      value={formData[id as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                      placeholder={placeholder}
                      className="mt-1 bg-[#0f0f17] border-purple-500/30 text-white"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {error && (
                <div className="w-full mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/owner/dashboard')}
                className="flex-1 border-purple-500/30 text-gray-300"
                disabled={isLoading}
              >
                Болих
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                disabled={isLoading}
              >
                {isLoading ? "Нэмж байна..." : "PC Төв Нэмэх"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
