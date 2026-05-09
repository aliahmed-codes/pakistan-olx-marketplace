'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, X, Loader2, Package,
  Smartphone, Car, Bike, Home, Monitor, Briefcase, Wrench, Sofa, Shirt,
  BookOpen, Baby, Cat, Factory, Zap, Leaf, Gamepad2, Gem, Plane,
  Coffee, type LucideProps,
} from 'lucide-react';

type IconComponent = React.FC<LucideProps>;
const ICON_MAP: Record<string, IconComponent> = {
  Smartphone, Car, Bike, Home, Monitor, Briefcase, Wrench, Sofa, Shirt,
  BookOpen, Baby, Cat, Factory, Zap, Leaf, Gamepad2, Gem, Plane, Coffee,
  Package,
};

function CatIcon({ icon, className }: { icon: string | null; className?: string }) {
  if (!icon) return <Package className={className} />;
  // Detect emoji by checking if the first character is in emoji ranges (simple heuristic)
  const code = icon.codePointAt(0) ?? 0;
  const isEmoji = code > 127; // anything above ASCII is likely an emoji or non-latin char
  if (isEmoji) {
    return <span className="text-xl leading-none">{icon}</span>;
  }
  // Otherwise treat it as a Lucide icon name
  const Icon = ICON_MAP[icon];
  return Icon ? <Icon className={className} /> : <Package className={className} />;
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string; name: string; slug: string;
  description: string | null; icon: string | null;
  image: string | null; isActive: boolean;
  _count: { ads: number };
}

const ICON_OPTIONS = ['📱','🚗','🏠','💻','🛋','👗','🔧','⚡','🌿','📚','🎮','💎','🏍','🐕','✈','🍔'];

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', icon: '📦', isActive: true,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories?all=true');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const autoSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', icon: '📦', isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setForm({
      name: cat.name, slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '📦',
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' }); return;
    }
    setIsSaving(true);
    try {
      const url    = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: editingId ? 'Category updated ✅' : 'Category created ✅' });
        fetchCategories();
        resetForm();
      } else {
        toast({ title: data.error || 'Save failed', variant: 'destructive' });
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setIsSaving(false); }
  };

  const handleToggle = async (cat: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, isActive: !cat.isActive }),
      });
      if (res.ok) { fetchCategories(); toast({ title: `Category ${cat.isActive ? 'deactivated' : 'activated'}` }); }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) { toast({ title: 'Category deleted' }); fetchCategories(); }
      else {
        const data = await res.json();
        toast({ title: data.error || 'Cannot delete', variant: 'destructive' });
      }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories · {categories.filter((c) => c.isActive).length} active</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gap-2 bg-pm hover:bg-pm-light rounded-xl"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className={`border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow ${!cat.isActive ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pm/10 to-pm-accent/10 flex items-center justify-center shrink-0 border border-pm/10 text-pm">
                    <CatIcon icon={cat.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{cat.name}</h3>
                      {!cat.isActive && <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-gray-400">Inactive</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Package className="h-3 w-3 text-gray-300" />
                      <p className="text-xs text-gray-400">{cat._count?.ads || 0} ads</p>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-lg text-xs"
                    onClick={() => startEdit(cat)}
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-lg text-xs"
                    onClick={() => handleToggle(cat)}
                  >
                    {cat.isActive
                      ? <ToggleRight className="h-3.5 w-3.5 text-emerald-500" />
                      : <ToggleLeft className="h-3.5 w-3.5 text-gray-400" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-lg text-xs text-red-400 hover:text-red-600 hover:border-red-200"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) resetForm(); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Categories appear in the main navigation and search filters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-xs">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : autoSlug(e.target.value) })}
                  placeholder="e.g. Mobile Phones"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: autoSlug(e.target.value) })}
                  placeholder="e.g. mobile-phones"
                  className="mt-1 rounded-xl font-mono text-sm"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Description (optional)</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Icon</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {ICON_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg border transition-all ${form.icon === emoji ? 'border-pm bg-pm/10 scale-110' : 'border-gray-200 hover:border-pm/50'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <Label className="text-xs cursor-pointer">Active (visible in navigation)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className="p-0 h-auto"
                >
                  {form.isActive
                    ? <ToggleRight className="h-7 w-7 text-emerald-500" />
                    : <ToggleLeft className="h-7 w-7 text-gray-300" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-xl"><X className="h-4 w-4 mr-1.5" /> Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-pm hover:bg-pm-light rounded-xl gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              This cannot be undone. All ads in this category will lose their category assignment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
