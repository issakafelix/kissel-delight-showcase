import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import {
  MenuItem,
  MenuCategory,
  MenuVariant,
  MenuAddon,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  formatPrice,
  displayFromPrice,
  slugify,
  cedisToPesewas,
  pesewasToCedis,
} from "@/lib/menu-data";
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

// Rows use cedis strings in the form; converted to pesewas ints on save.
interface OptionRow {
  key: string; // stable react key
  id: string;
  name: string;
  price: string; // cedis
}

interface MenuFormState {
  name: string;
  slug: string;
  description: string;
  price: string; // cedis
  image: string;
  category: MenuCategory;
  badge: string;
  available: boolean;
  sortOrder: string;
  variants: OptionRow[];
  addons: OptionRow[];
}

const EMPTY_FORM: MenuFormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  category: "rice",
  badge: "",
  available: true,
  sortOrder: "",
  variants: [],
  addons: [],
};

const toRows = (opts: (MenuVariant | MenuAddon)[] | undefined): OptionRow[] =>
  (opts ?? []).map((o, i) => ({ key: `${o.id}-${i}`, id: o.id, name: o.name, price: String(pesewasToCedis(o.price)) }));

// Top-level component: defining this inside MenuTab would recreate the
// component type on every render, remounting the inputs and dropping focus
// after each keystroke.
const OptionEditor = ({
  title,
  hint,
  rows,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  hint: string;
  rows: OptionRow[];
  onAdd: () => void;
  onUpdate: (key: string, patch: Partial<OptionRow>) => void;
  onRemove: (key: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>{title}</Label>
      <Button type="button" size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={onAdd}>
        <Plus className="w-3.5 h-3.5" /> Add
      </Button>
    </div>
    <p className="text-xs text-muted-foreground -mt-1">{hint}</p>
    {rows.map((row) => (
      <div key={row.key} className="flex items-center gap-2">
        <Input placeholder="Name (e.g. Large)" value={row.name} onChange={(e) => onUpdate(row.key, { name: e.target.value })} className="flex-1" />
        <div className="relative w-28">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₵</span>
          <Input type="number" min="0" step="0.5" placeholder="0.00" value={row.price} onChange={(e) => onUpdate(row.key, { price: e.target.value })} className="pl-5" />
        </div>
        <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0" onClick={() => onRemove(row.key)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    ))}
  </div>
);

const MenuTab = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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
      slug: item.slug ?? slugify(item.name),
      description: item.description,
      price: String(pesewasToCedis(item.price)),
      image: item.image,
      category: item.category,
      badge: item.badge ?? "",
      available: item.available,
      sortOrder: String(item.sortOrder),
      variants: toRows(item.variants),
      addons: toRows(item.addons),
    });
    setIsFormOpen(true);
  };

  const updateRow = (kind: "variants" | "addons", key: string, patch: Partial<OptionRow>) =>
    setForm((f) => ({ ...f, [kind]: f[kind].map((r) => (r.key === key ? { ...r, ...patch } : r)) }));

  const addRow = (kind: "variants" | "addons") =>
    setForm((f) => ({ ...f, [kind]: [...f[kind], { key: `new-${Date.now()}-${f[kind].length}`, id: "", name: "", price: "" }] }));

  const removeRow = (kind: "variants" | "addons", key: string) =>
    setForm((f) => ({ ...f, [kind]: f[kind].filter((r) => r.key !== key) }));

  // Turn form rows into stored options (pesewas). Returns null if a row is invalid.
  const rowsToOptions = (rows: OptionRow[]): { id: string; name: string; price: number }[] | null => {
    const out: { id: string; name: string; price: number }[] = [];
    for (const r of rows) {
      const name = r.name.trim();
      const cedis = parseFloat(r.price);
      if (!name || isNaN(cedis) || cedis < 0) return null;
      out.push({ id: r.id.trim() || slugify(name), name, price: cedisToPesewas(cedis) });
    }
    return out;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cedis = parseFloat(form.price);
    if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
      toast.error("Name, description and image URL are required.");
      return;
    }
    if (isNaN(cedis) || cedis <= 0) {
      toast.error("Enter a valid base price in cedis.");
      return;
    }
    const variants = rowsToOptions(form.variants);
    const addons = rowsToOptions(form.addons);
    if (variants === null) {
      toast.error("Every size needs a name and a valid price.");
      return;
    }
    if (addons === null) {
      toast.error("Every add-on needs a name and a valid price.");
      return;
    }

    const payload: Omit<MenuItem, "id"> = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim(),
      price: cedisToPesewas(cedis),
      image: form.image.trim(),
      category: form.category,
      available: form.available,
      sortOrder: parseInt(form.sortOrder, 10) || items.length + 1,
      // Firestore rejects undefined field values, so omit empty optionals.
      ...(form.badge.trim() ? { badge: form.badge.trim() } : {}),
      ...(variants.length ? { variants } : {}),
      ...(addons.length ? { addons } : {}),
    };

    setIsSaving(true);
    try {
      if (editing) {
        // include cleared fields so removing all variants/add-ons persists
        await db.updateMenuItem(editing.id, {
          ...payload,
          badge: payload.badge ?? "",
          variants: variants,
          addons: addons,
        });
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
    const msg = items.length
      ? "Reset the menu to the Kissel Food default? This deletes all current items and restores the built-in catalog."
      : "Upload the default Kissel Food menu to the Cloud?";
    if (!window.confirm(msg)) return;
    setIsSeeding(true);
    try {
      await db.seedMenu();
      toast.success("Menu synced. The website now serves the default catalog.");
    } catch (err) {
      console.error(err);
      toast.error("Seeding failed. Check your connection.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Menu Manager</h2>
          <p className="text-sm text-muted-foreground">
            Changes go live on the website instantly. Prices are entered in cedis (₵) and stored safely as pesewas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeed} disabled={isSeeding} className="gap-2">
            <CloudUpload className="w-4 h-4" /> {items.length ? "Reset to Default" : "Seed Default Menu"}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> New Item
          </Button>
        </div>
      </div>

      {loaded && items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-medium mb-1">The Cloud menu is empty.</p>
            <p className="text-sm">The website is serving the built-in static menu. Click <strong>Seed Default Menu</strong> to upload it so you can edit prices, sizes and availability live.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_ORDER.flatMap((cat) => items.filter((i) => i.category === cat)).map((item) => (
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
                <span className="font-bold text-primary whitespace-nowrap text-sm">
                  {item.variants && item.variants.length ? "from " : ""}{formatPrice(displayFromPrice(item))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[item.category]}
                {item.variants && item.variants.length ? ` · ${item.variants.length} sizes` : ""}
                {item.addons && item.addons.length ? ` · ${item.addons.length} add-ons` : ""}
                {item.badge ? ` · ${item.badge}` : ""}
              </p>
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
              <Input id="mi-name" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                placeholder="e.g. Grilled Chicken" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="mi-slug">Slug</Label>
              <Input id="mi-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} placeholder="grilled-chicken" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="mi-desc">Description</Label>
              <Textarea id="mi-desc" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mi-price">Base Price (₵)</Label>
                <Input id="mi-price" type="number" min="0" step="0.5" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                <p className="text-xs text-muted-foreground">Used when there are no sizes. With sizes, each size sets its own price.</p>
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as MenuCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="mi-image">Image URL</Label>
              <Input id="mi-image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://… or /menu/dish.jpg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mi-badge">Badge (optional)</Label>
                <Input id="mi-badge" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Popular, Chef's Special…" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="mi-sort">Sort Order</Label>
                <Input id="mi-sort" type="number" min="1" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
              </div>
            </div>

            <div className="border rounded-lg p-3 bg-muted/20">
              <OptionEditor
                title="Sizes / Variants"
                hint="Optional. If set, the customer must pick one and its price is used (e.g. Medium, Large)."
                rows={form.variants}
                onAdd={() => addRow("variants")}
                onUpdate={(key, patch) => updateRow("variants", key, patch)}
                onRemove={(key) => removeRow("variants", key)}
              />
            </div>
            <div className="border rounded-lg p-3 bg-muted/20">
              <OptionEditor
                title="Add-ons"
                hint="Optional extras that add to the price (e.g. Extra Chicken, Extra Cheese)."
                rows={form.addons}
                onAdd={() => addRow("addons")}
                onUpdate={(key, patch) => updateRow("addons", key, patch)}
                onRemove={(key) => removeRow("addons", key)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={form.available} onCheckedChange={(v) => setForm((f) => ({ ...f, available: v }))} />
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
