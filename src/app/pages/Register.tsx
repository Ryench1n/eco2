import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, Eye, EyeOff, Facebook } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [role, setRole] = useState<'user' | 'owner'>(
    new URLSearchParams(window.location.search).get('role') === 'owner' ? 'owner' : 'user'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Бүх талбаруудыг бөглөнө үү");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Нууц үг таарахгүй байна!");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Нууц үг дор хаяж 8 тэмдэгттэй байх ёстой");
      return;
    }

    try {
      await signUp(formData.name.trim(), formData.email.trim(), formData.password, role);
      toast.success("Бүртгэл амжилттай үүслээ!");
      navigate('/profile');
    } catch (error) {
      toast.error((error as Error).message || "Бүртгүүлэхэд алдаа гарлаа");
    }
  };

  const handleSocialLogin = (_provider: 'google' | 'facebook') => {
    toast.info("Нийгмийн сүлжээгээр нэвтрэх функц удахгүй нэмэгдэнэ");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-purple-950/20 to-[#0a0a0f] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1a1a24] border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Бүртгүүлэх
            </motion.h1>
            <p className="text-gray-400">ECO платформд тавтай морил</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Нэр</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Таны нэр"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">Хэрэглэгчийн төрөл</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'owner')}
                className="w-full px-4 py-3 bg-[#0f0f17] border border-purple-500/30 rounded-lg text-white"
              >
                <option value="user">Хэрэглэгч</option>
                <option value="owner">PC эзэмшигч</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">И-мэйл</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-[#0f0f17] border-purple-500/30 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Нууц үг</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-[#0f0f17] border-purple-500/30 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Нууц үг баталгаажуулах</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 bg-[#0f0f17] border-purple-500/30 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-6"
            >
              Бүртгүүлэх
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-400 bg-[#1a1a24]">эсвэл</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="border-purple-500/30 text-gray-300 hover:bg-purple-500/10"
              >
                <svg className="size-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin('facebook')}
                className="border-purple-500/30 text-gray-300 hover:bg-purple-500/10"
              >
                <Facebook className="size-5 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
