import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Thermometer, Zap, Droplets, Flame, Leaf, Clock } from "lucide-react";

const FoodDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const foodItems = [
    {
      id: 1,
      name: "Basmati Rice",
      category: "Grains",
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      fiber: 0.4,
      // Ayurvedic Properties
      rasa: ["Sweet"],
      virya: "Cooling",
      vipaka: "Sweet",
      doshaEffect: { vata: "Pacifies", pitta: "Pacifies", kapha: "Increases" },
      digestibility: "Easy",
      season: ["All seasons"],
      constitution: ["Vata", "Pitta"]
    },
    {
      id: 2,
      name: "Turmeric",
      category: "Spices",
      calories: 29,
      protein: 0.9,
      carbs: 6.3,
      fat: 0.3,
      fiber: 2.1,
      // Ayurvedic Properties
      rasa: ["Bitter", "Pungent"],
      virya: "Heating",
      vipaka: "Pungent",
      doshaEffect: { vata: "Pacifies", pitta: "Balances", kapha: "Pacifies" },
      digestibility: "Moderate",
      season: ["Winter", "Monsoon"],
      constitution: ["Vata", "Kapha"]
    },
    {
      id: 3,
      name: "Coconut",
      category: "Fruits",
      calories: 354,
      protein: 3.3,
      carbs: 15.2,
      fat: 33.5,
      fiber: 9.0,
      // Ayurvedic Properties
      rasa: ["Sweet"],
      virya: "Cooling",
      vipaka: "Sweet",
      doshaEffect: { vata: "Pacifies", pitta: "Pacifies", kapha: "Increases" },
      digestibility: "Heavy",
      season: ["Summer"],
      constitution: ["Vata", "Pitta"]
    },
    {
      id: 4,
      name: "Green Dal (Moong)",
      category: "Pulses",
      calories: 347,
      protein: 24.5,
      carbs: 63.4,
      fat: 1.2,
      fiber: 16.3,
      // Ayurvedic Properties
      rasa: ["Sweet", "Astringent"],
      virya: "Cooling",
      vipaka: "Sweet",
      doshaEffect: { vata: "Neutral", pitta: "Pacifies", kapha: "Neutral" },
      digestibility: "Easy",
      season: ["All seasons"],
      constitution: ["Pitta"]
    },
    {
      id: 5,
      name: "Ginger",
      category: "Spices",
      calories: 80,
      protein: 1.8,
      carbs: 17.8,
      fat: 0.8,
      fiber: 2.0,
      // Ayurvedic Properties
      rasa: ["Pungent"],
      virya: "Heating",
      vipaka: "Sweet",
      doshaEffect: { vata: "Pacifies", pitta: "Increases", kapha: "Pacifies" },
      digestibility: "Enhances",
      season: ["Winter", "Monsoon"],
      constitution: ["Vata", "Kapha"]
    }
  ];

  const categories = ["all", "Grains", "Spices", "Fruits", "Vegetables", "Pulses", "Dairy", "Oils"];

  const filteredFoods = foodItems.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDoshaColor = (effect: string) => {
    switch (effect) {
      case "Pacifies": return "text-success bg-success/10";
      case "Increases": return "text-warning bg-warning/10";
      case "Balances": return "text-primary bg-primary/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getViryaIcon = (virya: string) => {
    return virya === "Heating" ? <Flame className="h-3 w-3" /> : <Droplets className="h-3 w-3" />;
  };

  const getDigestibilityColor = (digestibility: string) => {
    switch (digestibility) {
      case "Easy": return "text-success";
      case "Heavy": return "text-warning";
      case "Enhances": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Ayurvedic Food Database</h2>
          <p className="text-muted-foreground">8,000+ items with complete nutritional and Ayurvedic analysis</p>
        </div>
        <Button className="shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search food items..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Food Items Grid */}
      <div className="grid gap-6">
        {filteredFoods.map((food) => (
          <Card key={food.id} className="shadow-soft hover:shadow-strong transition-all duration-300">
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Basic Info & Nutrition */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{food.name}</h3>
                      <Badge variant="outline">{food.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{food.calories} cal per 100g</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Nutritional Profile</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{food.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">{food.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{food.fat}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span className="font-medium">{food.fiber}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ayurvedic Properties */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Ayurvedic Properties</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center mb-2">
                        <Leaf className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Rasa (Taste)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {food.rasa.map(taste => (
                          <Badge key={taste} variant="secondary" className="text-xs">
                            {taste}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Thermometer className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Virya (Potency)</span>
                      </div>
                      <div className="flex items-center">
                        {getViryaIcon(food.virya)}
                        <span className="text-sm ml-1">{food.virya}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm font-medium">Digestibility</span>
                      </div>
                      <span className={`text-sm font-medium ${getDigestibilityColor(food.digestibility)}`}>
                        {food.digestibility}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dosha Effects */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Dosha Effects</h4>
                  
                  <div className="space-y-3">
                    {Object.entries(food.doshaEffect).map(([dosha, effect]) => (
                      <div key={dosha} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium capitalize">{dosha}</span>
                        </div>
                        <Badge className={getDoshaColor(effect as string)}>
                          {effect}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Best for Constitution:</div>
                    <div className="flex flex-wrap gap-1">
                      {food.constitution.map(constitution => (
                        <Badge key={constitution} variant="outline" className="text-xs">
                          {constitution}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Add to Diet Chart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFoods.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No food items found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FoodDatabase;