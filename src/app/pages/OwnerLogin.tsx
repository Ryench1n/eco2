import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Store } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function OwnerLogin() {
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
      await signIn(email.trim(), password, "owner");
      toast.success("Амжилттай нэвтэрлээ!");
      navigate("/owner/dashboard");
    } catch (error) {
      toast.error((error as Error).message || "Нэвтрэхэд алдаа гарлаа");
    }
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
            Өөрийн тоглоомын төвийг бүртгэх,
            <br />
            удирдах, статистик харах
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
                  onClick={() => navigate('/register?role=owner')}
                  className="flex-1 py-3 px-6 rounded-lg font-semibold bg-transparent text-gray-400 hover:text-white"
                >
                  Бүртгүүлэх
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Эзэмшигч нэвтрэх" : "Эзэмшигч бүртгүүлэх"}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Өөрийн мэдээллээ оруулж нэвтрэнэ үү
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Имэйл хаяг эсвэл төвийн нэр
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="email@example.com эсвэл төвийн нэр"
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
                      placeholder="•••••••"
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
                  <Store className="size-5 mr-2" />
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

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Бүртгэлгүй юу? {" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
                  </button>
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    ← Сонголт руу буцах
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-purple-400 hover:text-purple-300">
                    Нүүр хуудас
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}