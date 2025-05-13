export interface MenuItem {
  name: string;
  category: string;
  type: 'veg' | 'non-veg';
  description?: string;
  isSpicy?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menu: {
  veg: MenuCategory[];
  nonVeg: MenuCategory[];
  common: MenuCategory[];
} = {
  veg: [
    {
      name: "Veg Starter",
      items: [
        { name: "Grill Veg", category: "starter", type: "veg" },
        { name: "Mushroom", category: "starter", type: "veg" },
        { name: "Paneer", category: "starter", type: "veg" },
        { name: "Veg Kebab", category: "starter", type: "veg" },
        { name: "Cajun Spice Potato", category: "starter", type: "veg" },
        { name: "Pineapple", category: "starter", type: "veg" }
      ]
    },
    {
      name: "Veg Main Course",
      items: [
        { name: "Noodles", category: "main", type: "veg" },
        { name: "Oriental Veg", category: "main", type: "veg" },
        { name: "Paneer", category: "main", type: "veg" },
        { name: "Aloo", category: "main", type: "veg" },
        { name: "Veg Kofta", category: "main", type: "veg" },
        { name: "Veg Dry & Gravy", category: "main", type: "veg" },
        { name: "Dal Tadka", category: "main", type: "veg" },
        { name: "Dal Makhani", category: "main", type: "veg" },
        { name: "Veg Biryani", category: "main", type: "veg" },
        { name: "Rice", category: "main", type: "veg" }
      ]
    }
  ],
  nonVeg: [
    {
      name: "Non-Veg Starter",
      items: [
        { name: "Chicken Tangdi", category: "starter", type: "non-veg" },
        { name: "Chicken Skewer", category: "starter", type: "non-veg" },
        { name: "Mutton", category: "starter", type: "non-veg" },
        { name: "Fish", category: "starter", type: "non-veg" },
        { name: "Prawns", category: "starter", type: "non-veg" }
      ]
    },
    {
      name: "Non-Veg Main Course",
      items: [
        { name: "Non Veg Biryani", category: "main", type: "non-veg" },
        { name: "Mutton Curry", category: "main", type: "non-veg" },
        { name: "Chicken Curry", category: "main", type: "non-veg" },
        { name: "Fish Gravy", category: "main", type: "non-veg" }
      ]
    }
  ],
  common: [
    {
      name: "Soup",
      items: [
        { name: "Veg Soup", category: "soup", type: "veg" },
        { name: "Non Veg Soup", category: "soup", type: "non-veg" }
      ]
    },
    {
      name: "Salads",
      items: [
        { name: "Salad Veg - 4 varieties", category: "salad", type: "veg" },
        { name: "Salad Non Veg", category: "salad", type: "non-veg" }
      ]
    },
    {
      name: "Dessert",
      items: [
        { name: "Angori Gulab Jamun", category: "dessert", type: "veg" },
        { name: "Phirnee", category: "dessert", type: "veg" },
        { name: "Ice Cream", category: "dessert", type: "veg" },
        { name: "Pie/tart", category: "dessert", type: "veg" },
        { name: "Fruits", category: "dessert", type: "veg" },
        { name: "Pastry", category: "dessert", type: "veg" },
        { name: "Brownie", category: "dessert", type: "veg" },
        { name: "Pudding/soufflé", category: "dessert", type: "veg" }
      ]
    }
  ]
};

export const getMenuByType = (type: 'veg' | 'non-veg' | 'all'): MenuCategory[] => {
  if (type === 'veg') {
    return [...menu.veg, ...menu.common.filter(cat => 
      cat.items.some(item => item.type === 'veg'))];
  } else if (type === 'non-veg') {
    return [...menu.nonVeg, ...menu.common.filter(cat => 
      cat.items.some(item => item.type === 'non-veg'))];
  }
  return [...menu.veg, ...menu.nonVeg, ...menu.common];
};

export const getItemsByCategory = (category: string): MenuItem[] => {
  const allCategories = [...menu.veg, ...menu.nonVeg, ...menu.common];
  const foundCategory = allCategories.find(cat => cat.name.toLowerCase() === category.toLowerCase());
  return foundCategory?.items || [];
};

export const searchMenu = (query: string): MenuItem[] => {
  const allItems = [...menu.veg, ...menu.nonVeg, ...menu.common]
    .flatMap(category => category.items);
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()));
}; 