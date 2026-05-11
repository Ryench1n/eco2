import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { User, Store } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Logo } from "../components/Logo";

export function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-purple-900/60 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>
              <Logo className="h-24 w-auto relative z-10" />
            </div>
          </div>
          <p className="text-gray-400 text-lg">Тоглоомын төвүүдийг нэг дороос</p>
        </motion.div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* User Login Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#1a1a24]/80 backdrop-blur-md border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-2xl mb-4">
                    <User className="size-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Энгийн хэрэглэгч</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Тоглоомын төвүүдийг хайж олох, захиалга өгөх, сул суудал шалгах
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/login/user")}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12 text-base font-semibold"
                >
                  <User className="size-5 mr-2" />
                  Нэвтрэх
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="w-full mt-3 text-gray-400 hover:text-white hover:bg-purple-500/10"
                >
                  Бүртгүүлэх
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Owner Login Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#1a1a24]/80 backdrop-blur-md border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-2xl mb-4">
                    <Store className="size-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Эзэмшигч</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Өөрийн тоглоомын төвийг бүртгэх, удирдах, статистик харах
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/login/owner")}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12 text-base font-semibold"
                >
                  <Store className="size-5 mr-2" />
                  Нэвтрэх
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="w-full mt-3 text-gray-400 hover:text-white hover:bg-purple-500/10"
                >
                  Бүртгүүлэх
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-gray-400 text-sm">Тоглоомын төвүүд</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10k+</div>
            <div className="text-gray-400 text-sm">Идэвхтэй хэрэглэгчид</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">4.8+</div>
            <div className="text-gray-400 text-sm">Дундаж үнэлгээ</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}