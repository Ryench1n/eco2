import { Search, User, Menu, X, LogOut, LayoutDashboard, Filter, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";

export function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { searchTerm, setSearchTerm, districtFilter, setDistrictFilter, ratingFilter, setRatingFilter, sortBy, setSortBy } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    // Navigate to home page with search params or trigger search
    navigate('/', { state: { searchTriggered: true } });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f17]/95 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <Logo className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>

          {/* Search Bar with Filters - Desktop */}
          <div className="hidden lg:flex flex-1 items-center gap-3 max-w-4xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Нэр эсвэл байршил..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a24] border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
            
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-[180px] bg-[#1a1a24] border-purple-500/30 text-white">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Бүх дүүрэг" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-purple-500/30">
                <SelectItem value="all" className="text-gray-300">Бүх дүүрэг</SelectItem>
                <SelectItem value="Сүхбаатар" className="text-gray-300">Сүхбаатар</SelectItem>
                <SelectItem value="Хан-Уул" className="text-gray-300">Хан-Уул</SelectItem>
                <SelectItem value="Баянзүрх" className="text-gray-300">Баянзүрх</SelectItem>
                <SelectItem value="Сонгино" className="text-gray-300">Сонгинохайрхан</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter?.toString() || "all"} onValueChange={(value) => setRatingFilter(value === "all" ? null : parseFloat(value))}>
              <SelectTrigger className="w-[150px] bg-[#1a1a24] border-purple-500/30 text-white">
                <Star className="size-4 mr-2" />
                <SelectValue placeholder="Бүх үнэлгээ" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-purple-500/30">
                <SelectItem value="all" className="text-gray-300">Бүх үнэлгээ</SelectItem>
                <SelectItem value="4.5" className="text-gray-300">4.5+ од</SelectItem>
                <SelectItem value="4.0" className="text-gray-300">4.0+ од</SelectItem>
                <SelectItem value="3.5" className="text-gray-300">3.5+ од</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#1a1a24] border-purple-500/30 text-white">
                <SelectValue placeholder="Үнэлгээгээр" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-purple-500/30">
                <SelectItem value="rating" className="text-gray-300">Үнэлгээгээр</SelectItem>
                <SelectItem value="price-low" className="text-gray-300">Үнэ: Бага → Их</SelectItem>
                <SelectItem value="price-high" className="text-gray-300">Үнэ: Их → Бага</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8"
            >
              Хайх
            </Button>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {!isLoggedIn ? (
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              >
                <User className="size-4 mr-2" />
                Нэвтрэх
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200">
                    <User className="size-4 mr-2" />
                    {user?.name || 'Профайл'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1a24] border-purple-500/30">
                  <DropdownMenuItem
                    onClick={() => navigate(user?.type === 'owner' ? '/owner/dashboard' : '/profile')}
                    className="text-gray-300 hover:bg-purple-500/20 hover:text-white cursor-pointer"
                  >
                    <LayoutDashboard className="size-4 mr-2" />
                    {user?.type === 'owner' ? 'Хянах самбар' : 'Миний профайл'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-500/30" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                  >
                    <LogOut className="size-4 mr-2" />
                    Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4 border-t border-purple-500/20 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a24] border-purple-500/30 text-white"
              />
            </div>

            {!isLoggedIn ? (
              <Button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                <User className="size-4 mr-2" />
                Нэвтрэх
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    navigate(user?.type === 'owner' ? '/owner/dashboard' : '/profile');
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-purple-500/30 text-gray-300"
                >
                  <LayoutDashboard className="size-4 mr-2" />
                  {user?.type === 'owner' ? 'Хянах самбар' : 'Миний профайл'}
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400"
                >
                  <LogOut className="size-4 mr-2" />
                  Гарах
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}