import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, Mail, Shield } from "lucide-react";
import { getUsers, type User } from "../../lib/dataService";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Users className="size-8 text-purple-500" />
        <h2 className="text-3xl font-bold text-white">Хэрэглэгчид</h2>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No users found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1a1a24] border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <Mail className="size-4" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-cyan-400" />
                    <Badge
                      className={`${
                        user.role === "owner"
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                          : "bg-gray-700"
                      } text-white border-0 capitalize`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
