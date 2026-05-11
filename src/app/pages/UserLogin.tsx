import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Facebook } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function UserLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Имэйл болон нууц үг оруулна уу");
      return;
    }

    try {
      await signIn(email.trim(), password, "user");
      toast.success("Амжилттай нэвтэрлээ!");
      navigate("/profile");
    } catch (error) {
      toast.error((error as Error).message || "Нэвтрэхэд алдаа гарлаа");
    }
  };

  const handleSocialLogin = (_provider: "google" | "facebook") => {
    toast.info("Нийгмийн сүлжээгээр нэвтрэх функц удахгүй нэмэгдэнэ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-purple-900/60 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col items-center justify-center"
        >
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-3xl blur-2xl opacity-30"></div>
            <Logo className="h-48 w-auto relative z-10" />
          </div>
          <p className="text-gray-400 text-center text-lg">
            Монголын шилдэг тоглоомын төвүүдийг нэг дороос олж,
            <br />
            захиалга өгөх, сул суудал шалгах
          </p>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#1a1a24]/80 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                    isLogin
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      : "bg-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Нэвтрэх
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold bg-transparent text-gray-400 hover:text-white"
                >
                  Бүртгүүлэх
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Тавтай морил" : "Бүртгүүлэх"}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Өөрийн мэдээллээ оруулж нэвтрэнэ үү
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Имэйл хаяг эсвэл утасны дугаар
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="email@example.com эсвэл 99999999"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-[#0f0f17] border-purple-500/30 text-white placeholder:text-gray-500 h-12 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-300 text-sm">Нууц үг</label>
                    {isLogin && (
                      <button
                        type="button"
                        className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                      >
                        Нууц үгээ мартсан?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-[#0f0f17] border-purple-500/30 text-white placeholder:text-gray-500 h-12 focus:border-purple-500"
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12 text-base font-semibold"
                >
                  <Lock className="size-5 mr-2" />
                  Нэвтрэх
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a24] text-gray-400">эсвэл</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
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

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Бүртгэлгүй юу? {" "}
                  <Link
                    to="/register"
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Бүртгүүлэх
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    ← Сонголт руу буцах
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link to="/" className="text-purple-400 hover:text-purple-300">
                    Нүүр хуудас
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}