import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { MenuItem, MenuCategory, CATEGORY_LABELS, formatGHS } from "@/lib/menu-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CloudUpload, Pencil, Plus, Trash2 } from "lucide-react";

interface MenuFormState {
  name: string;
  description: string;
  price: string;
  image: string;
  category: MenuCategory;
  badge: string;
  available: boolean;
  sortOrder: string;
}

const EMPTY_FORM: MenuFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "mains",
  badge: "",
  available: true,
  sortOrder: "",
};

const MenuTab = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = db.subscribeMenu((menuItems) => {
      setItems(menuItems);
      setLoaded(true);
    });
    return unsubscribe;
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, sortOrder: String(items.length + 1) });
    setIsFormOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
      category: item.category,
      badge: item.badge ?? "",
      available: item.available,
      sortOrder: String(item.sortOrder),
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
      toast.error("Name, description and image URL are required.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      toast.error("Enter a valid price in GH₵.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      category: form.category,
      badge: form.badge.trim(),
      available: form.available,
      sortOrder: parseInt(form.sortOrder, 10) || items.length + 1,
    };

    setIsSaving(true);
    try {
      if (editing) {
        await db.updateMenuItem(editing.id, payload);
        toast.success(`${payload.name} updated.`);
      } else {
        await db.addMenuItem(payload);
        toast.success(`${payload.name} added to the menu.`);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save menu item.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await db.updateMenuItem(item.id, { available: !item.available });
      toast.success(`${item.name} marked as ${item.available ? "sold out" : "available"}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability.");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.name}" from the menu? This cannot be undone.`)) return;
    try {
      await db.deleteMenuItem(item.id);
      toast.success(`${item.name} deleted.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  const handleSeed = async () => {
    try {
      await db.seedMenu();
      toast.success("Default menu uploaded to the Cloud! The website now serves it live.");
    } catch (err) {
      console.error(err);
      toast.error("Seeding failed. Check your connection.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Menu Manager</h2>
          <p className="text-sm text-muted-foreground">
            Changes go live on the website instantly. Toggle availability when a dish sells out.
          </p>
        </div>
        <div className="flex gap-2">
          {loaded && items.length === 0 && (
            <Button variant="outline" onClick={handleSeed} className="gap-2">
              <CloudUpload className="w-4 h-4" /> Seed Default Menu
            </Button>
          )}
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> New Item
          </Button>
        </div>
      </div>

      {loaded && items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-medium mb-1">The Cloud menu is empty.</p>
            <p className="text-sm">The website is currently serving the built-in static menu. Click <strong>Seed Default Menu</strong> to upload it here so you can edit prices and availability live.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={!item.available ? "opacity-70" : undefined}>
            <div className="h-36 overflow-hidden rounded-t-lg relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; }} />
              {!item.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Sold Out</Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
                <span className="font-bold text-primary whitespace-nowrap text-sm">{formatGHS(item.price)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[item.category]}{item.badge ? ` · ${item.badge}` : ""}</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium">
                  <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item)} />
                  {item.available ? "Available" : "Sold out"}
                </label>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit: ${editing.name}` : "New Menu Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="mi-name">Name</Label>
              <Input id="mi-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Waakye Special" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="mi-desc">Description</Label>
              <Textarea id="mi-desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mi-price">Price (GH₵)</Label>
                <Input id="mi-price" type="number" min="0" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as MenuCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mains">{CATEGORY_LABELS.mains}</SelectItem>
                    <SelectItem value="pastries">{CATEGORY_LABELS.pastries}</SelectItem>
                    <SelectItem value="drinks">{CATEGORY_LABELS.drinks}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="mi-image">Image URL</Label>
              <Input id="mi-image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… or /menu/dish.jpg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mi-badge">Badge (optional)</Label>
                <Input id="mi-badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Popular, Chef's Special…" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mi-sort">Sort Order</Label>
                <Input id="mi-sort" type="number" min="1" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
              Available for ordering
            </label>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add to Menu"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuTab;
