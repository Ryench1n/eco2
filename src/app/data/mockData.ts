export interface PCCenter {
  id: string;
  ownerId?: string;
  name: string;
  address: string;
  image: string;
  totalSeats: number;
  seatCounts?: {
    hall: number;
    vip: number;
    stage: number;
  };
  rating: number;
  reviewCount: number;
  description: string;
  gears: {
    cpu: string;
    gpu: string;
    ram: string;
    monitor: string;
    keyboard: string;
    mouse: string;
    headset: string;
  };
  contactPhone: string;
  facebookPage: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    hall: number;
    vip: number;
    stage: number;
  };
}

export interface Review {
  id: string;
  pcCenterId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Seat {
  id: string;
  number: number;
  type: 'hall' | 'vip' | 'stage';
  isAvailable: boolean;
}

export const pcCenters: PCCenter[] = [
  {
    id: "1",
    name: "P Gaming",
    address: "Сүхбаатар дүүрэг, 11-р хороолол",
    image: "https://scontent.fuln6-2.fna.fbcdn.net/v/t39.30808-6/689045451_991920306905759_3874837930576802444_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=5_NUfFmNc5QQ7kNvwEmrlrJ&_nc_oc=AdoCoRz2qL6kNBPrZ6Gu-HiPJl-IhsOqQKEFFhQSQd63jp-8nSaGZ0sUWTg-k3uj3OvGCmgcMS0R6hXKGTlvsCcC&_nc_zt=23&_nc_ht=scontent.fuln6-2.fna&_nc_gid=WHT58xDDgD8yCyMkWf3Msg&_nc_ss=7b2a8&oh=00_Af6GU9wswYTRsvxrDktT9FSriEw9f8obM9J_qWbQweGfog&oe=6A074AAC",
    totalSeats: 35,
    rating: 4.8,
    reviewCount: 156,
    description: "Тав тухтай орчин, найрсаг хамт олон",
    gears: {
      cpu: "Intel Core i9-13900K",
      gpu: "NVIDIA RTX 4080",
      ram: "32GB DDR5",
      monitor: "ASUS ROG Swift 27\" 240Hz",
      keyboard: "Razer BlackWidow V3",
      mouse: "Logitech G Pro X Superlight",
      headset: "HyperX Cloud II"
    },
    contactPhone: "+976 9944-1791",
    facebookPage: "www.facebook.com/pgaming9911",
    openingHours: {
      monday: "10:00 - 23:00",
      tuesday: "10:00 - 23:00",
      wednesday: "10:00 - 23:00",
      thursday: "10:00 - 23:00",
      friday: "10:00 - 01:00",
      saturday: "10:00 - 01:00",
      sunday: "10:00 - 23:00"
    },
    pricing: {
      hall: 5000,
      vip: 8000,
      stage: 10000
    }
  },
  {
    id: "2",
    name: "Nexus E-sport center",
    address: "Сүхбаатар дүүрэг, Azmall",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIZTyJv3SR-ymnf0-K_V5HSbgHBVpyrut8Cw&s",
    totalSeats: 200,
    rating: 4.6,
    reviewCount: 98,
    description: "Монголын хамгийн олон суудалтай, өндөр үзүүлэлт, тухтай орчин, хямд",
    gears: {
      cpu: "AMD Ryzen 9 7950X",
      gpu: "NVIDIA RTX 4070 Ti",
      ram: "32GB DDR5",
      monitor: "BENQ \"",
      keyboard: "Corsair K70 RGB",
      mouse: "Razer DeathAdder V3",
      headset: "SteelSeries Arctis Pro"
    },
    contactPhone: "+976 7588-4411",
    facebookPage: "fb.com/cyberarenaub",
    openingHours: {
      monday: "09:00 - 22:00",
      tuesday: "09:00 - 22:00",
      wednesday: "09:00 - 22:00",
      thursday: "09:00 - 22:00",
      friday: "09:00 - 00:00",
      saturday: "09:00 - 00:00",
      sunday: "09:00 - 22:00"
    },
    pricing: {
      hall: 4000,
      vip: 6000,
      stage: 7000
    }
  },
  {
    id: "3",
    name: "SKOL Gaming",
    address: "Сүхбаатар дүүрэг, Циркийн хажууд",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-66csztv57JA_s1_06pYZo2LLtzYGu_cIFQ&s",
    totalSeats: 35,
    rating: 4.9,
    reviewCount: 204,
    description: "Хотын төвд байрлалтай, тухтай орчин, өндөр үзүүлэлт.",
    gears: {
      cpu: "Intel Core i7-13700K",
      gpu: "NVIDIA RTX 4090",
      ram: "64GB DDR5",
      monitor: "LG UltraGear 27\" 165Hz",
      keyboard: "SteelSeries Apex Pro",
      mouse: "Logitech G502 X",
      headset: "Razer BlackShark V2"
    },
    contactPhone: "+976 7200-5055",
    facebookPage: "www.facebook.com/CreatexEsport",
    openingHours: {
      monday: "10:00 - 00:00",
      tuesday: "10:00 - 00:00",
      wednesday: "10:00 - 00:00",
      thursday: "10:00 - 00:00",
      friday: "10:00 - 02:00",
      saturday: "10:00 - 02:00",
      sunday: "10:00 - 00:00"
    },
    pricing: {
      hall: 6000,
      vip: 9000,
      stage: 12000
    }
  },
  {
    id: "4",
    name: "LANNHUB",
    address: "Сүхбаатар дүүрэг, МУИС 8-р байрны урд",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWxMh4uTEWHi9PJPnu6l3YiX09VKlJnGVCPw&s",
    totalSeats: 35,
    rating: 4.7,
    reviewCount: 132,
    description: "Хичээл сургуультай ойр, дундаж үзүүлэлт, тухтай орчин",
    gears: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "NVIDIA RTX 4080",
      ram: "32GB DDR5",
      monitor: "BenQ Zowie XL2546K 24.5\" 240Hz",
      keyboard: "Ducky One 3",
      mouse: "Finalmouse Starlight-12",
      headset: "Audio-Technica ATH-M50x"
    },
    contactPhone: "+976 8850-1792",
    facebookPage: "https://www.facebook.com/p/LANN-Hub-61557531350190/",
    openingHours: {
      monday: "11:00 - 23:00",
      tuesday: "11:00 - 23:00",
      wednesday: "11:00 - 23:00",
      thursday: "11:00 - 23:00",
      friday: "11:00 - 01:00",
      saturday: "11:00 - 01:00",
      sunday: "11:00 - 23:00"
    },
    pricing: {
      hall: 2800,
      vip: 4800,
      stage: 7200
    }
  }
];

export const reviews: Review[] = [
  {
    id: "r1",
    pcCenterId: "1",
    userName: "Батболд",
    userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Dajgui orchintoi, goy pc bno",
    date: "2026-03-15"
  },
  {
    id: "r2",
    pcCenterId: "1",
    userName: "Энхжин",
    userAvatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Uzuulelt undur bolhor shan blaa",
    date: "2026-03-10"
  },
  {
    id: "r3",
    pcCenterId: "1",
    userName: "Тэмүүлэн",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    comment: "Nairsag hamt olontoi, dhd zaaval irnee",
    date: "2026-03-05"
  },
  {
    id: "r4",
    pcCenterId: "2",
    userName: "Оюунаа",
    userAvatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Monitor ni bur kino2",
    date: "2026-03-12"
  },
  {
    id: "r5",
    pcCenterId: "3",
    userName: "Тэмүүлэн",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "RTX 4090 setup galzuu!",
    date: "2026-03-18"
  }
];

export const generateSeats = (pcCenterId: string): Seat[] => {
  const seats: Seat[] = [];
  let id = 1;
  
  // Hall seats (1-20)
  for (let i = 1; i <= 20; i++) {
    seats.push({
      id: `${pcCenterId}-seat-${id}`,
      number: i,
      type: 'hall',
      isAvailable: Math.random() > 0.3 
    });
    id++;
  }
  
  for (let i = 21; i <= 30; i++) {
    seats.push({
      id: `${pcCenterId}-seat-${id}`,
      number: i,
      type: 'vip',
      isAvailable: Math.random() > 0.4 
    });
    id++;
  }
  

  for (let i = 31; i <= 35; i++) {
    seats.push({
      id: `${pcCenterId}-seat-${id}`,
      number: i,
      type: 'stage',
      isAvailable: Math.random() > 0.5
    });
    id++;
  }
  
  return seats;
};