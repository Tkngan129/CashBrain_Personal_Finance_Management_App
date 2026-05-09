import { useState } from 'react';
import { Coffee, ShoppingBag, Car, Home, Heart, GraduationCap, Smartphone, UtensilsCrossed, Plane, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const initialCategories = [
  { id: 'food', name: 'Food', icon: Coffee, color: '#FF6B6B', spending: 45000, transactions: 1 },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#FFA07A', spending: 250000, transactions: 1 },
  { id: 'transport', name: 'Transport', icon: Car, color: '#DDA15E', spending: 25000, transactions: 1 },
  { id: 'home', name: 'Home', icon: Home, color: '#A8DADC', spending: 0, transactions: 0 },
  { id: 'health', name: 'Health', icon: Heart, color: '#F4A3A8', spending: 0, transactions: 0 },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#4ECDC4', spending: 399000, transactions: 1 },
  { id: 'tech', name: 'Technology', icon: Smartphone, color: '#9D84B7', spending: 0, transactions: 0 },
  { id: 'dining', name: 'Dining Out', icon: UtensilsCrossed, color: '#FFB6B9', spending: 0, transactions: 0 },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#95E1D3', spending: 0, transactions: 0 },
];

export function CategoriesScreen() {
  const [categories] = useState(initialCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleEdit = (categoryName: string) => {
    toast.success(`Edit ${categoryName} (Coming soon)`);
  };

  const handleDelete = (categoryName: string) => {
    toast.error(`Delete ${categoryName} (Coming soon)`);
  };

  return (
    <div className="h-full overflow-y-auto pb-20 bg-gradient-to-b from-white/5 to-transparent">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="font-semibold text-lg mb-1">Categories</h2>
            <p className="text-sm text-white/80">{categories.length} categories</p>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white/25"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 pt-4">
        <div className="space-y-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg hover:bg-white/15 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20"
                    style={{ backgroundColor: `${category.color}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: category.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 text-white">{category.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span>₫{category.spending.toLocaleString()} spent</span>
                      <span>•</span>
                      <span>{category.transactions} transactions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category.name)}
                      className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-all hover:bg-white/15"
                    >
                      <Edit2 className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.name)}
                      className="w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-400/30 flex items-center justify-center active:scale-95 transition-all hover:bg-red-500/25"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>

                {/* Progress bar for spending */}
                {category.spending > 0 && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all shadow-sm"
                        style={{
                          backgroundColor: category.color,
                          width: `${Math.min((category.spending / 400000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add New Category Dialog (simplified) */}
      {showAddDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50"
          onClick={() => setShowAddDialog(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white/15 backdrop-blur-2xl border border-white/20 rounded-t-3xl p-6 shadow-2xl"
          >
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" />
            <h3 className="font-semibold mb-4 text-white">Add New Category</h3>
            <p className="text-sm text-white/80 mb-6">
              This feature is coming soon. You'll be able to create custom categories with your own icons and colors.
            </p>
            <button
              onClick={() => setShowAddDialog(false)}
              className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white rounded-2xl py-3 font-semibold active:scale-95 transition-all hover:bg-white/25 shadow-lg"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
